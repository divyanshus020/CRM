'use client';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock } from 'lucide-react';
import { loginUser } from '@/lib/api';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
    const { login } = useAuth();
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                console.log('Form Data:', values);
                const data = await loginUser(values);
                console.log('Response Data:', data);
                if (data?.success) {
                    toast.success(data.message || 'Login successful!', {
                        duration: 8000,
                        position: 'top-center',
                    });

                    login(data.token, data.user);

                    // await new Promise(resolve => setTimeout(resolve, 1000)); 
                    // router.push('/dashboard'); // Handled by login function in context
                } else {
                    toast.error(data?.message || 'Login failed');
                }

            } catch (error) {
                console.error('Login Error:', error);
                toast.error(error.message || 'Something went wrong during login!');
            }

        }
    },
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                            <Mail className="text-gray-400 mr-2" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                className="w-full outline-none"
                            />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                            <Lock className="text-gray-400 mr-2" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                className="w-full outline-none"
                            />
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500">
                    Don't have an account? <Link href="/register" className="text-blue-600 cursor-pointer">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

import { supabase, supabaseAdmin } from "../config/supabaseClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// User Registration Controller
export const registerUser = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    // Check if user already exists in auth.users
    console.log('Checking if user exists in auth.users...');
    const { data: { users: existingAuthUsers }, error: authCheckError } = await supabaseAdmin.auth.admin.listUsers({
      filter: { email }
    });
    const existingAuthUser = existingAuthUsers?.[0];
    
    if (existingAuthUser) {
      console.log('User already exists in auth.users:', existingAuthUser.id);
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    // Check if user exists in public.users (as a fallback)
    console.log('Checking if user exists in public.users...');
    const { data: existingDbUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingDbUser) {
      console.log('User exists in public.users but not in auth.users, cleaning up...');
      // Clean up orphaned user record
      await supabase
        .from('users')
        .delete()
        .eq('email', email);
    }

    console.log('Creating user in auth.users...');
    // Create user in auth.users table (Supabase Auth)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:5173/login', // Update this with your frontend login URL
        data: {
          name,
        },
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error(`Auth error: ${authError.message}`);
    }

    console.log('Auth user created:', authData.user?.id);

    // Create user in public.users table
    console.log('Creating user in public.users...');
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .insert([
        { 
          id: authData.user?.id,
          name,
          email,
          password: await bcrypt.hash(password, 10) // Store hashed password as a fallback
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Attempt to clean up auth user if database insert fails
      if (authData.user?.id) {
        try {
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
          console.log('Cleaned up auth user after failed DB insert');
        } catch (cleanupError) {
          console.error('Failed to clean up auth user:', cleanupError);
        }
      }
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log('User created in public.users:', userData.id);

    // Generate JWT token
    const token = jwt.sign(
      { id: userData.id, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Omit password from response
    const { password: _, ...userWithoutPassword } = userData;

    console.log('Registration successful for user:', userWithoutPassword.email);
    return res.status(201).json({ 
      success: true,
      message: "User registered successfully. Please check your email to verify your account.",
      data: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      stack: error.stack,
      ...error
    });
    
    return res.status(500).json({
      success: false,
      message: `Failed to register user: ${error.message}`,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password"
      });
    }

    // Get user data from public.users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw userError;
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: userData.id, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Omit password from response
    const { password: _, ...userWithoutPassword } = userData;

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      success: true,
      message: `Welcome back ${userData.name}`,
      data: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error.message
    });
  }
};
import jwt from "jsonwebtoken"

const isAuthntiacted = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        // console.log(req.cookies)
        if(!token){
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
              });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY)

        

        if(!decode){
            return res.status(401).json({
                message: "Invalid Token",
                success: false,
              });
        }

        req.id = decode.userId

        next()
    } catch (error) {
        console.log(error)
    }
}

export default isAuthntiacted
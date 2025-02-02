import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import { emailValidation } from "@/validationSchemas/signupSchema";

export const GET = async (req) => {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);

        const result = emailValidation.safeParse(searchParams.get("email"));
        
        if(!result.success) {
            const emailErrors = result.error.format()._errors || [];
            console.log();
            return Response.json(
                {
                    success: false,
                    message: emailErrors.length>0 ? emailErrors.join(', ') : "Invalid email",
                },
                { status: 201 }
            );
        }

        const email = result.data;

        const userExists = await User.findOne({ email });
        if(userExists) {
            return Response.json(
                {
                    success: false,
                    message: "Email already taken",
                },
                { status: 201 }
            );
        } else {
            return Response.json(
                {
                    success: true,
                    message: "Email available",
                },
                { status: 200 }
            );
        }
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error checking email availability",
            },
            { status: 500 }
        );
    }
};
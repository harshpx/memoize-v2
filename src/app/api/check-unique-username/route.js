import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import { usernameValidation } from "@/validationSchemas/signupSchema";

export const GET = async (req) => {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);

        const result = usernameValidation.safeParse(searchParams.get("username"));
        
        if(!result.success) {
            const usernameErrors = result.error.format()._errors || [];
            return Response.json(
                {
                    success: false,
                    message: usernameErrors.length>0 ? usernameErrors.join(', ') : "Invalid username",
                },
                { status: 201 }
            );
        }

        const username = result.data;

        const userExists = await User.findOne({ username });
        if(userExists) {
            return Response.json(
                {
                    success: false,
                    message: "Username already taken",
                },
                { status: 201 }
            );
        } else {
            return Response.json(
                {
                    success: true,
                    message: "Username available",
                },
                { status: 200 }
            );
        }
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error checking username availability",
            },
            { status: 500 }
        );
    }
}
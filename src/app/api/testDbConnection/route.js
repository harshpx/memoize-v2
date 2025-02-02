import connectToDatabase from "@/lib/db"
export const GET = async(req) => {
    try {
        const db = await connectToDatabase();
        return Response.json (
            {
                success: true,
                message: "Connected to database",
            },{status: 200}
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Failed to connect to database",
            },{status: 500}
        )
    }
}
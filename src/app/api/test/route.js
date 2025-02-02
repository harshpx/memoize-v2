export const GET = async (req) => {
    return Response.json(
        {
            success: true,
            message: "Test Route called successfully!",
        },
        { status: 200 }
    );
};

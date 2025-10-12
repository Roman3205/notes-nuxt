export default defineEventHandler(async (event) => {
  try {
    const protectedRoutes = ["/api/notes"];

    const isProtected = protectedRoutes.some((route) =>
      getRequestURL(event).pathname.startsWith(route)
    );
    if (!isProtected) {
      return;
    }

    const token = getCookie(event, 'app')

    if(!token) {
      throw createError({
        statusCode: 401,
        message: 'Not authorized to update'
      })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }


    event.context.userId = decoded.id;
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Issues with authorization",
    });
  }
});

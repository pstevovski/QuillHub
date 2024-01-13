## Token Serivce & Middleware updates

- Update the token service `verifyToken` to return:
  - a boolean indicating if the token is valid or not, based on payload value (if present)
  - a user property containing only user-related details from the verified token
  - and the full original payload (if needed somewhere)
- Add additional method `refreshToken` that will be called from within `verifyToken`:

  - This will make use of the `exp` (expires_at) property
  - If the time of token verification was close to expiration (e.g. 10 minutes OR less from it), silently refresh the token

- Update the middleware to remove unnecessary first check if the requested URL is starting with `/auth`
  - Same applies for the other check for `/auth` route request
  - Reason for this: The dedicated authentication pages will be removed
  - Process will be handled trough a modal-like box that the user can interact with trough the header

## Homepage

- Add the header of the application
- Add the main CTA section of the homepage
  - Will list the name of the app, the quote, and a CTA button
  - The button will either be `Sign In` or `Write a Post!` based on if the user is authenticated or not
- Add initial titles for other sections such as Trending, Bookmarked ..?
- Update the authentication flow:
  - Remove (now) unnecessary authentication pages
  - Add a card (or modal) for authentication
  - Update the layout of the forms:
    - Left sided text
    - Input fields will have labels besides placeholders
    - Different auth forms should enter/exit from within the same modal based on what the user has selected
    - For "Reset Password" action check if the URL has a `token=123&modal=reset_password` parameter to open the modal with the correct form

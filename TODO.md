## Token Serivce & Middleware updates

- **DONE** Add a new endpoint for refreshing tokens -> `token/refresh` [x]
- **DONE** Add method for handling refreshing the tokens [x]
- **DONE** Add client context provider that will be checking the `expiresTimetsamp` value saved in local storage
  every 10 seconds to check if its time to refresh the existing token silently [x]
  - **DONE** The check will be for 10 minutes BEFORE the expiration time of the token [x]
  - **DONE** If its time to refresh it, send request to the new endpoint that will issue new `accessToken`
    and update its value saved as an `httpOnly` cookie [x]
  - **DONE** After this update the `expiresTimestamp` value saved in local storage [x]
  - **DONE** If there's no `refresh token` or it has expired, then clear out all tokens from cookies and redirect
    the user to the signin page [x]
- **DONE** Handle `remember_me` scenario in refresh token method [x]
  - **DONE** No need, if this is selected refresh token lasts 90 days and after
    the first 30 days of access token duration, the token will then be
    checked for expiration every 8h [x]
- **DONE** Refresh access token in middleware function, if the token is not valid but theres a valid refresh token [x]
- **DONE** Remove handling of "expiresTimestamp" - NOT NEEDED [x]
  - **DONE** Remove `TokenContextProvider` [x]
  - **DONE** Remove `useCheckTokenExpiration` hook [x]
  - **DONE** Remove handling of `expiresTimestamp` in regards to local storage
  - Reason for this:
    - All checks happen in the middleware before processing the resource that was requested
    - If theres a valid refresh token, but no access token and/or cookie for it (e.g. it expired)
      then whenever a page or API endpoint is requested, middleware is triggered which first issues a new access token
      and proceeds to the requested resource
    - If theres no valid refresh token and no access token, middleware clears out all cookies and redirects user to auth/signin page
      preventing any requests to the protected endpoints

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

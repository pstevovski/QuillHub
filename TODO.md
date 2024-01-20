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

- **DONE** Add the main CTA section of the homepage [x]
  - **DONE** Will list the name of the app, the quote, and a "Start Writing" CTA button [x]
- **DONE** Add initial Trending section [x]
- **DONE** Add handling of blog section filters based on search parameters,
  so different sections will be shown based on what the user has currently selected [x]
  - **DONE** Add client component for handling this [x]

## Authentication Flow Updates

- Update the layout's header for new authentication flow purposes:
  - When clicked on "Sign In" button, a modal should open up where the user can sign in/register/forget/reset password
  - When user is already signed in, instead of a button, show:
    - User avatar which will use the logged in user's initials (or selected profile picture?)
    - Message `Hi, ${username}` with a chevron
    - When clicked, opens up a dropdown menu that contains the following links (order TBD):
      - Sign Out
      - My Profile
      - Stats
      - Settings
      - Bookmarks
      - ..?
- Update the authentication flow:
  - Remove (now) unnecessary authentication pages
  - Add a card (or modal) for authentication
  - Update the layout of the forms:
    - Left sided text
    - Input fields will have labels besides placeholders
    - Different auth forms should enter/exit from within the same modal based on what the user has selected
    - For "Reset Password" action check if the URL has a `token=123&modal=reset_password` parameter to open the modal with the correct form
- Remove current "/protected" page and from the list of protected endpoints

## Create & Edit Blog Post page

- Page:

  - Protected page
  - Should have a form containing a couple of fields:
    - Title
    - Image
    - Topic
    - Content (WYSIWYG editor)
    - Status
  - Edit page will be the same, with pre-populated fields
  - ..?

- API:
  - Protected endpoints
  - Service for handling blog posts, including methods for:
    - creating
    - updating
    - deleting
    - getting specific blog post details
    - getting all blog posts
  - Database table schema & migration
  - ..?

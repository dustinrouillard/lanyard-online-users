# Lanyard Online Users

Displays usage of Lanyard profile cards.

Working on moving the card to a drop-in react component and then will soon be making an SVG generator for non-web things like your github profile.

This project is hosted at [lanyard.dstn.to](https://lanyard.dstn.to)

## Adding yourself to the watched users

Important to remember when making your PR, don't make any other file changes besides to the `users.ts` file in the src folder.

You are required to keep the array in the current order and follow the style, ensuring that there are 2 space tabs, and a trailing comma with your name in a comment after the ID.

### Example

```ts
export const WatchedUsers = [
  '94490510688792576', // Phineas
  '156114103033790464', // Dustin
  'YOUR-DISCORD-ID', // YourName
];
```

const router = require('express').Router();
const authRoute = require('./auth.route');
const chatRoute = require('./chat.route')
const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/',
    route: chatRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;

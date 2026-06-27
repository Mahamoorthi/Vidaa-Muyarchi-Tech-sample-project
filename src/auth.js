const { Issuer, custom } = require('openid-client');

// Set timeout for openid-client requests
custom.setHttpOptionsDefaults({
  timeout: 5000,
});

let oidcClient = null;
let isInitializing = false;
let initError = null;

const KEYCLOAK_URL = 'http://localhost:8080';
const REALM = 'student-management';
const CLIENT_ID = 'student-app';
const CLIENT_SECRET = 'client-secret-placeholder'; // Set if client is confidential

async function getOidcClient() {
  if (oidcClient) return oidcClient;
  if (isInitializing) return null;

  isInitializing = true;
  initError = null;

  try {
    console.log(`Discovering Keycloak issuer at ${KEYCLOAK_URL}/realms/${REALM}...`);
    const keycloakIssuer = await Issuer.discover(`${KEYCLOAK_URL}/realms/${REALM}`);
    console.log('Discovered issuer successfully.');

    oidcClient = new keycloakIssuer.Client({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uris: ['http://localhost:3001/callback'],
      response_types: ['code'],
    });

    isInitializing = false;
    return oidcClient;
  } catch (err) {
    initError = err.message;
    console.warn(`Keycloak OIDC discovery failed: ${err.message}. Falling back to mock authentication for development.`);
    isInitializing = false;
    return null;
  }
}

// Background retry loop
setInterval(async () => {
  if (!oidcClient) {
    await getOidcClient();
  }
}, 10000);

// Initialize on startup
getOidcClient();

const auth = {
  // Middleware to ensure user is logged in
  isAuthenticated: (req, res, next) => {
    if (req.session && (req.session.user || req.session.mockUser)) {
      return next();
    }
    // If not authenticated, redirect to login page
    res.redirect('/login-portal');
  },

  // Middleware to check for specific role
  hasRole: (role) => {
    return (req, res, next) => {
      // Check mock user roles first
      if (req.session && req.session.mockUser) {
        if (req.session.mockUser.roles.includes(role)) {
          return next();
        }
      }

      // Check Keycloak token roles
      if (req.session && req.session.user && req.session.user.roles) {
        if (req.session.user.roles.includes(role)) {
          return next();
        }
      }

      // Track authorization failure for metrics
      if (global.authFailuresCounter) {
        global.authFailuresCounter.inc({ role: role, path: req.path });
      }

      res.status(403).send('Forbidden: You do not have the required role (' + role + ') to access this resource.');
    };
  },

  // Helper to extract roles from Keycloak tokens
  extractRoles: (tokenSet) => {
    const claims = tokenSet.claims();
    const roles = [];
    
    // Realm roles
    if (claims.realm_access && claims.realm_access.roles) {
      roles.push(...claims.realm_access.roles);
    }
    // Client roles
    if (claims.resource_access && claims.resource_access[CLIENT_ID] && claims.resource_access[CLIENT_ID].roles) {
      roles.push(...claims.resource_access[CLIENT_ID].roles);
    }
    
    return roles;
  },

  getOidcClient,
  getClientId: () => CLIENT_ID,
  getRealm: () => REALM,
  getKeycloakUrl: () => KEYCLOAK_URL,
  getInitError: () => initError
};

module.exports = auth;

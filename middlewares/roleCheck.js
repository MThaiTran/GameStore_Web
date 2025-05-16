function checkRolePermission(req, res, next) {
  // Bỏ qua nếu chưa xác thực hoặc không có user
  if (!req.user) {
    return next();
  }

  console.log('Checking permissions for:', {
    path: req.originalUrl,
    method: req.method,
    userRole: req.user.role,
    userId: req.user.id
  });

  // Cho phép tất cả các request GET đi qua
  if (req.method === 'GET') {
    console.log('GET request allowed');
    return next();
  }

  const restrictedPathsForUser = ['/api/user', '/api/role', '/api/game', '/api/genre'];
  const isUser = req.user.role === 2;

  // Kiểm tra xem đường dẫn có bị giới hạn cho user không
  const isRestrictedPath = restrictedPathsForUser.some(path => {
    const isRestricted = req.originalUrl.startsWith(path);
    if (isRestricted) {
      console.log(`Path ${req.originalUrl} matches restricted path ${path}`);
    }
    return isRestricted;
  });

  if (isUser && isRestrictedPath) {
    console.log('Permission denied for user role');
    return res.status(403).json({
      message: 'Permission denied for this resource',
      path: req.originalUrl,
      method: req.method,
      role: req.user.role
    });
  }

  console.log('Permission granted');
  next();
}

module.exports = { checkRolePermission };

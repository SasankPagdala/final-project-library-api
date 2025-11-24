import prisma from '../config/db.js';

export function checkListPermission(requiredPermission = 'VIEW') {
  return async (req, res, next) => {
    try {
      const listId = parseInt(req.params.listId, 10);
      const userId = req.user.id;

      if (Number.isNaN(listId)) {
        return res.status(400).json({
          error: 'Validation failed',
          details: ['listId must be a number'],
        });
      }

      // Check if list exists
      const list = await prisma.list.findUnique({
        where: { id: listId },
      });

      if (!list) {
        return res.status(404).json({ error: 'List not found' });
      }

      // If user is the owner, they have all permissions
      if (list.ownerId === userId) {
        return next();
      }

      // Check if list is shared with the user
      const share = await prisma.listShare.findUnique({
        where: {
          listId_sharedWithUserId: {
            listId,
            sharedWithUserId: userId,
          },
        },
      });

      if (!share) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have access to this list',
        });
      }

      // Check permission level
      if (requiredPermission === 'EDIT' && share.permissionLevel === 'VIEW') {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You only have view access to this list',
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

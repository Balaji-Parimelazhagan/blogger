/**
 * @file Event types and payload structures for Blog Event Notification System
 * @module notifications/eventTypes
 */

/**
 * @typedef {Object} CommentEventPayload
 * @property {string} postId
 * @property {string} commentId
 * @property {string} content
 * @property {string} authorId
 */

/**
 * @typedef {Object} PostEventPayload
 * @property {string} postId
 * @property {string} title
 * @property {string} authorId
 * @property {string} [status] // e.g., 'created', 'updated', 'deleted'
 */

/**
 * @typedef {Object} UserEventPayload
 * @property {string} userId
 * @property {string} action // e.g., 'profile_updated', 'followed', 'unfollowed'
 * @property {Object} [details]
 */

/**
 * @typedef {Object} ModerationEventPayload
 * @property {string} targetId // postId or commentId
 * @property {string} moderatorId
 * @property {string} action // e.g., 'flagged', 'approved', 'removed'
 * @property {string} [reason]
 */

/**
 * Factory for creating a BlogEvent
 * @param {string} type
 * @param {Object} payload
 * @param {string} userId
 * @returns {BlogEvent}
 */
function createBlogEvent(type, payload, userId) {
  return {
    type,
    payload,
    timestamp: new Date(),
    userId
  };
}

module.exports = {
  createBlogEvent
}; 
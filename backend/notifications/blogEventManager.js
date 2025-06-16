const { Subject } = require('./observerPattern');

/**
 * BlogEventManager - Concrete Subject for managing blog events and notifying observers
 */
class BlogEventManager extends Subject {
  constructor() {
    super();
    // Placeholder for event log or persistence
    this.eventLog = [];
    // Placeholder for rate limiting logic
    this.rateLimitMap = new Map();
  }

  /**
   * Notify all observers and persist/log the event
   * @param {BlogEvent} event
   */
  notify(event) {
    // Persist/log event (placeholder)
    this.eventLog.push(event);
    // TODO: Add rate limiting logic here
    // Call parent notify
    super.notify(event);
  }

  /**
   * Get all logged events (for audit trail)
   * @returns {BlogEvent[]}
   */
  getEventLog() {
    return this.eventLog;
  }
}

module.exports = BlogEventManager; 
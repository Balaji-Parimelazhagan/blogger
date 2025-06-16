/**
 * @file Observer Pattern base interfaces and classes for Blog Event Notification System
 * @module notifications/observerPattern
 */

/**
 * @typedef {Object} BlogEvent
 * @property {string} type - The type of the event (e.g., 'NEW_COMMENT', 'POST_UPDATED')
 * @property {Object} payload - The event payload (event-specific data)
 * @property {Date} timestamp - The time the event occurred
 * @property {string} userId - The user who triggered the event
 */

/**
 * Observer interface
 * @interface
 */
class Observer {
  /**
   * Receive update from subject
   * @param {BlogEvent} event
   */
  update(event) {
    throw new Error('Observer.update() must be implemented by subclass');
  }
}

/**
 * Subject (Event Manager) interface
 * @interface
 */
class Subject {
  constructor() {
    /** @type {Observer[]} */
    this.observers = [];
  }

  /**
   * Attach an observer
   * @param {Observer} observer
   */
  attach(observer) {
    this.observers.push(observer);
  }

  /**
   * Detach an observer
   * @param {Observer} observer
   */
  detach(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  /**
   * Notify all observers
   * @param {BlogEvent} event
   */
  notify(event) {
    this.observers.forEach(observer => observer.update(event));
  }
}

module.exports = {
  Observer,
  Subject
}; 
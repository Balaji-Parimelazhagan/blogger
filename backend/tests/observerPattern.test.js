const BlogEventManager = require('../notifications/blogEventManager');
const InAppNotificationObserver = require('../notifications/inAppNotificationObserver');
const { createBlogEvent } = require('../notifications/eventTypes');

describe('Observer Pattern: Blog Event Notification System', () => {
  let eventManager;
  let observer;
  let notifications;

  beforeEach(() => {
    eventManager = new BlogEventManager();
    notifications = [];
    // Mock observer to capture notifications
    observer = new InAppNotificationObserver();
    observer.update = jest.fn(event => notifications.push(event));
    eventManager.attach(observer);
  });

  test('should notify observer on event', () => {
    const event = createBlogEvent('NEW_COMMENT', { postId: 1, commentId: 2, content: 'Test', authorId: 'user1' }, 'user1');
    eventManager.notify(event);
    expect(observer.update).toHaveBeenCalledWith(event);
    expect(notifications).toContain(event);
  });

  test('should not notify detached observer', () => {
    eventManager.detach(observer);
    const event = createBlogEvent('NEW_COMMENT', { postId: 1, commentId: 2, content: 'Test', authorId: 'user1' }, 'user1');
    eventManager.notify(event);
    expect(observer.update).not.toHaveBeenCalled();
    expect(notifications).toHaveLength(0);
  });

  test('should log events in eventLog', () => {
    const event = createBlogEvent('POST_CREATED', { postId: 1, title: 'Hello', authorId: 'user2', status: 'created' }, 'user2');
    eventManager.notify(event);
    expect(eventManager.getEventLog()).toContain(event);
  });
}); 
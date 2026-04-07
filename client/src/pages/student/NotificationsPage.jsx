import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../../store/slices/notificationSlice";
import {
  AlertCircle,
  BadgeCheck,
  BellOff,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Clock5,
  MessageCircle,
  Settings,
  User,
} from "lucide-react";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notification.list);
  const unreadCount = useSelector((state) => state.notification.unreadCount);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const markAsReadHandler = (id) => dispatch(markAsRead(id));
  const markAllAsReadHandler = () => dispatch(markAllAsRead());
  const deleteNotificationHandler = (id) => dispatch(deleteNotification(id));

  const getNotificationIcon = (type) => {
    switch (type) {
      case "feedback":
        return <MessageCircle className="w-6 h-6 text-blue-500" />;

      case "deadline":
        return <Clock5 className="w-6 h-6 text-red-500" />;

      case "approval":
        return <BadgeCheck className="w-6 h-6 text-green-500" />;

      case "meeting":
        return <Calendar className="w-6 h-6 text-purple-500" />;

      case "system":
        return <Settings className="w-6 h-6 text-gray-500" />;

      default:
        return (
          <div
            className="relative w-6 h-6 text-slate-500 
        flex items-center justify-center">
            <User className="w-5 h-5 absolute" />
            <ChevronDown className="w-4 h-4 absolute top-4" />
          </div>
        );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-slate-300";
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();

    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hrs ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 1) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  };

  const stats = [
    {
      title: "Total",
      value: notifications.length,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
      titleColor: "text-blue-800",
      valueColor: "text-blue-900",
      Icon: User,
    },
    {
      title: "Unread",
      value: unreadCount,
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      textColor: "text-red-600",
      titleColor: "text-red-800",
      valueColor: "text-red-900",
      Icon: AlertCircle,
    },
    {
      title: "High Priority",
      value: Array.isArray(notifications)
        ? notifications.filter((n) => n.priority === "high").length
        : 0,
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-600",
      titleColor: "text-yellow-800",
      valueColor: "text-yellow-900",
      Icon: Clock,
    },
    {
      title: "This Week",
      value: Array.isArray(notifications)
        ? notifications.filter((n) => {
            const notifDate = new Date(n.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return notifDate >= weekAgo;
          }).length
        : 0,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      textColor: "text-green-600",
      titleColor: "text-green-800",
      valueColor: "text-green-900",
      Icon: CheckCircle2,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="card">
          {/* Card header */}
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="card-title">Notifications</h1>
                <p className="card-subtitle">
                  Stay updated with your project progress and deadlines
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  className="btn-outline btn-small"
                  onClick={markAllAsReadHandler}>
                  Mark all as read ({unreadCount})
                </button>
              )}
            </div>
          </div>
          {/* notifications stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((item, i) => {
              return (
                <div className={`${item.bg} rounded-lg p-4`} key={i}>
                  <div className="flex items-center ">
                    <div className={`p-2 ${item.iconBg} rounded-lg`}>
                      <item.Icon className={`w-5 h-5 ${item.textColor}`} />
                    </div>

                    <div className="ml-3">
                      <p className={`text-sm font-medium ${item.titleColor}`}>
                        {item.title}
                      </p>
                      <p className={`text-sm font-medium ${item.valueColor}`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* notification list */}
          <div className="space-y-3">
            {Array.isArray(notifications) &&
              notifications.map((notification) => {
                return (
                  <div
                    key={notification._id}
                    className={`group relative flex gap-4 rounded-2xl border p-4 transition-all duration-300 shadow-sm 
  ${
    !notification.isRead
      ? "bg-blue-50 border-blue-200 shadow-md"
      : "bg-white border-slate-200 hover:bg-slate-50 hover:shadow-md"
  } 
  ${getPriorityColor(notification.priority)}`}>
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Top Row */}
                      <div className="flex items-start justify-between mb-2">
                        {/* Title */}
                        <h3
                          className={`font-semibold text-sm sm:text-base flex items-center gap-2 
        ${!notification.isRead ? "text-slate-900" : "text-slate-700"}`}>
                          {notification.title}

                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block animate-pulse" />
                          )}
                        </h3>

                        {/* Date */}
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>

                      {/* Message */}
                      <p className="text-slate-600 text-sm leading-relaxed mb-3">
                        {notification.message}
                      </p>

                      {/* Bottom Row */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        {/* Type Badge */}
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium capitalize
        ${
          notification.type === "feedback"
            ? "bg-blue-100 text-blue-700"
            : notification.type === "deadline"
              ? "bg-red-100 text-red-700"
              : notification.type === "approval"
                ? "bg-green-100 text-green-700"
                : notification.type === "meeting"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700"
        }`}>
                          {notification.type}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          {!notification.isRead && (
                            <button
                              onClick={() =>
                                markAsReadHandler(notification._id)
                              }
                              className="text-xs font-medium text-blue-600 hover:text-blue-500 transition">
                              Mark as read
                            </button>
                          )}

                          <button
                            onClick={() =>
                              deleteNotificationHandler(notification._id)
                            }
                            className="text-xs font-medium text-red-600 hover:text-red-500 transition">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-8">
              <BellOff className="w-12 h-12 mx-auto text-slate-400" />
              <p className="text-slate-500 mt-2">No Notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;

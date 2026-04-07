import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProject, getFeedback } from "../../store/slices/studentSlice";
import { AlertTriangle, BadgeCheck, MessageCircle } from "lucide-react";

const FeedbackPage = () => {
  const dispatch = useDispatch();
  const { project, feedback } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchProject());
  }, [dispatch]);

  useEffect(() => {
    if (project?._id) {
      dispatch(getFeedback(project._id));
    }
  }, [dispatch, project]);

  const getFeedbackIcon = (type) => {
    if (type === "positive") {
      return <BadgeCheck className="h-6 w-6 text-green-500" />;
    }
    if (type === "negative") {
      return <AlertTriangle className="h-6 w-6 text-red-500" />;
    }
    return <MessageCircle className="h-6 w-6 text-blue-500" />;
  };

  const feedbackStats = [
    {
      type: "general",
      title: "Total Feedback",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-800",
      valueColor: "text-blue-900",
      getCount: (feedback) => feedback?.length || 0,
    },
    {
      type: "positive",
      title: "Positive",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      textColor: "text-green-800",
      valueColor: "text-green-900",
      getCount: (feedback) =>
        feedback.filter((f) => f.type === "positive").length,
    },
    {
      type: "negative",
      title: "Needs Revision",
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-800",
      valueColor: "text-yellow-900",
      getCount: (feedback) =>
        feedback.filter((f) => f.type === "negative").length,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* feedback header */}
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Supervisor Feedback</h1>
            <p className="card-subtitle">
              View feedback and comments from your supervisor
            </p>
          </div>
        </div>

        {/* feedback stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {feedbackStats.map((item, i) => {
            return (
              <div className={`${item.bg} rounded-lg p-4`} key={i}>
                <div className="flex items-center ">
                  <div className={`p-2 ${item.iconBg} rounded-lg`}>
                    {getFeedbackIcon(item.type)}
                  </div>

                  <div className="ml-3">
                    <p className={`text-sm font-medium ${item.textColor}`}>
                      {item.title}
                    </p>
                    <p className={`text-sm font-medium ${item.valueColor}`}>
                      {item.getCount(feedback)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* feedback list */}
        <div className="space-y-4">
          {feedback && feedback.length > 0 ? (
            feedback.map((f, i) => {
              return (
                <div
                  key={i}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getFeedbackIcon(f.type)}
                        <h3 className="font-medium text-slate-800">
                          {f.title || "Feedback"}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm border-slate-600">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </p>
                      <p>{f.supervisorName || "Supervisor"}</p>
                    </div>
                  </div>

                  <div className=" bg-slate-50 rounded-lg mb-4">
                    <p className="text-slate-700 leading-relaxed">
                      {f.message}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-3">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No feedback received yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FeedbackPage;

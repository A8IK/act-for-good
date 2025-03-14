import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Comments = ({ eventId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No auth token found. Please log in again.");
                }

                const response = await fetch(`http://localhost:9000/api/helpRequests/comments/${eventId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    // body: JSON.stringify({ comment: newComment }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch comments");
                }

                const data = await response.json()
                console.log("Comments:", data);
                setComments(data);
            }
            catch (error) {
                console.error("Failed to fetch comments", error);
            }
        }
        fetchComments();
    }, [eventId]);

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) {
            toast.warning("Comment cannot be empty!");
            return;
        }

        const authToken = localStorage.getItem("token");

        console.log("Commenting on event:", eventId);
        console.log("Authorization Token:", authToken);

        if (!authToken) {
            toast.error("You need to log in to comment!");
            return;
        }

        try {
            console.log("Submitting comment for event ID:", eventId);

            const response = await fetch(`http://localhost:9000/api/helpRequests/comment/${eventId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
                body: JSON.stringify({ comment: newComment }),
            });
            console.log(`Request Body: ${JSON.stringify({ comment: newComment })}`);
            console.log("Response Data:", response.data);

            const result = await response.json();

            console.log("Response Data:", result); //debugging

            if (response.ok) {
                const newCommentData = result.comment || { 
                    text: newComment, 
                    user: { name: "anonymous" }, 
                    createdAt: new Date().toISOString() 
                };
    
                setComments([...comments, newCommentData]);
                setNewComment("");
                toast.success("Comment added successfully!");
            }
            else {
                console.error("Failed to add comment", result.error);
                toast.error("An error occurred while adding the comment!");
            }
        }
        catch (error) {
            console.error("Error submittng comment", error);
        }
    };

    return (
        <div>
            <strong className='text-amber-50 text-2xl'>Comments : </strong>
            {comments.map((comment, index) => (
                <div key={comment._id || `comment-${index}`}className='p-2 border-b'>
                    <p><strong>{comment.user?.name || 'anonymous'}</strong>: {comment.text || comment.message || comment.body}</p>
                    <p className="text-xs text-gray-500">{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Unkonwn time"}</p>
                </div>
            ))}
            <textarea type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Comments" className="textarea textarea-info mt-4"></textarea>

            <div className="card-actions flex justify-start mt-4">
                <button onClick={handleCommentSubmit} className="btn btn-primary">Comment</button>
            </div>
        </div>
    );
};

export default Comments;
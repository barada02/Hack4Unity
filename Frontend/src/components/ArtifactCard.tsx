import React, { useState } from 'react'
import { artifactApi } from '../services/artifactApi'
import type { Artifact, Comment } from '../types/artifact'
import { useAuth } from '../contexts/AuthProvider'

interface ArtifactCardProps {
  artifact: Artifact
  onUpdate: (updatedArtifact: Artifact) => void
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, onUpdate }) => {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const { isAuthenticated, profile } = useAuth()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCommentDate = (dateString: string) => {
    const now = new Date()
    const commentDate = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return formatDate(dateString)
  }

  const handleLike = async () => {
    if (!isAuthenticated || isLiking) return
    
    setIsLiking(true)
    try {
      const response = await artifactApi.toggleLike(artifact.artifactId)
      if (response.success) {
        // Update the artifact with new like status
        const updatedArtifact = {
          ...artifact,
          isLikedByUser: response.data?.liked || false,
          likesCount: response.data?.liked 
            ? (artifact.likesCount || 0) + 1 
            : Math.max((artifact.likesCount || 0) - 1, 0)
        }
        onUpdate(updatedArtifact)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleAddComment = async () => {
    if (!isAuthenticated || !newComment.trim() || isSubmittingComment) return
    
    setIsSubmittingComment(true)
    try {
      const response = await artifactApi.addComment(artifact.artifactId, newComment.trim())
      if (response.success) {
        // Add the new comment to the artifact
        const newCommentObj: Comment = {
          _id: Date.now().toString(), // Temporary ID
          userId: profile?.userId || '',
          userName: profile?.displayName || 'Anonymous',
          comment: newComment.trim(),
          createdAt: new Date().toISOString()
        }
        
        const updatedArtifact = {
          ...artifact,
          comments: [...(artifact.comments || []), newCommentObj]
        }
        onUpdate(updatedArtifact)
        setNewComment('')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddComment()
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-xl overflow-hidden backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group">
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-slate-900">
        {artifact.imageUrl ? (
          <img 
            src={artifact.imageUrl} 
            alt={artifact.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
            <span className="text-4xl opacity-50">🎨</span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6">
          <h4 className="text-white font-semibold mb-3">Wolfram Expression:</h4>
          <div className="bg-slate-900/90 rounded-lg p-3 text-xs text-green-400 font-mono max-h-32 overflow-y-auto">
            {artifact.expression}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-300">
              Format: {artifact.format.toUpperCase()}
            </span>
            <span className="text-xs text-slate-300">
              {formatDate(artifact.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
          {artifact.title}
        </h3>
        
        {/* Tags */}
        {artifact.tags && artifact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {artifact.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {artifact.tags.length > 3 && (
              <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
                +{artifact.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer with Author and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {artifact.author?.displayName?.[0] || 'U'}
            </div>
            <span className="text-xs text-slate-400">
              {artifact.author?.displayName || 'Anonymous'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={!isAuthenticated || isLiking}
              className={`text-xs flex items-center space-x-1 transition-colors ${
                artifact.isLikedByUser 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-slate-400 hover:text-red-400'
              } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <span>{artifact.isLikedByUser ? '❤️' : '🤍'}</span>
              <span>{artifact.likesCount || 0}</span>
            </button>
            
            {/* Comment Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-xs flex items-center space-x-1 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
            >
              <span>💬</span>
              <span>{artifact.comments?.length || 0}</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-slate-700 pt-4 mt-4">
            {/* Existing Comments */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {artifact.comments && artifact.comments.length > 0 ? (
                artifact.comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {comment.userName?.[0] || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-slate-700/50 rounded-lg p-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-slate-300">{comment.userName}</span>
                          <span className="text-xs text-slate-500">{formatCommentDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-slate-200">{comment.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-2">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>

            {/* Add Comment */}
            {isAuthenticated ? (
              <div className="flex space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {profile?.displayName?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a comment..."
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-500">Press Enter to post, Shift+Enter for new line</span>
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs text-white rounded transition-colors"
                    >
                      {isSubmittingComment ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-xs text-slate-500 mb-2">Sign in to join the conversation</p>
                <a 
                  href="/login" 
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Sign In
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
import {Link, useParams} from "react-router-dom";

const PostPage=({posts, handleDelete})=>{
  const {id} =useParams();
  const post=posts.find(post=>(post.id).toString()===id);
  return(
    <main className="PostPage">
      <article className="post">
        {post &&
          <>
            <h2>{post.title}</h2>
            <p className="postDate">{post.datetime}</p>
            <p className="postBody">{post.body}</p>
            <Link to={`/edit/${post.id}`}>
              <button className='editButton'>EditPost</button></Link>
            <button className='deleteButton' onClick={()=> handleDelete(post.id)}>
              DeletePost
            </button>
          </>
        }
        {!post &&
          <>
            <h2>Post Not Found</h2>
          </>
        }
      </article>
    </main>
  )
}

export default PostPage
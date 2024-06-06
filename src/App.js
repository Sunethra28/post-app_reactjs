import About from "./About";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import Missing from "./Missing";
import Nav from "./Nav";
import Post from "./Post";
//import PostLayout from "./PostLayout";
import {useState, useEffect} from "react"
import {Routes, Route, Link, useNavigate} from "react-router-dom"
import {format} from "date-fns";
import api from "./api/posts";
import EditPost from "./EditPost";
import useWindowSize from "./hooks/useWindowSize";

function App() {
  const [posts, setPosts]=useState([])
  const [search, setSearch]=useState('');
  const [searchResults, setSearchResults]=useState([]);
  const [postTitle, setPostTitle]=useState('');
  const [postBody, setPostBody]=useState('');
  const navigate=useNavigate();
  const [editTitle, setEditTitle]=useState('');
  const [editBody, setEditBody]=useState('');
  const{width}=useWindowSize()

  useEffect(()=>{
    const fetchPosts=async()=>{
      try{
        const response=await api.get('posts');
        setPosts(response.data);
      }
      catch(err){
        console.log(`Error:${err.message}`);
      }
    }
    fetchPosts();
  }, [])

  useEffect(()=>{
    const filteredResults=posts.filter((post)=>
      ((post.body).toLowerCase()).includes(search.toLowerCase()) ||
      ((post.title).toLowerCase()).includes(search.toLowerCase()));
      setSearchResults(filteredResults.reverse());
    }, [posts, search])

  // useEffect(() => {
  //   const filteredResults = posts.filter((post) => {
  //     const body = post.body ? post.body.toLowerCase() : '';
  //     const title = post.title ? post.title.toLowerCase() : '';
  //     const searchTerm = search.toLowerCase();
  //     return body.includes(searchTerm) || title.includes(searchTerm);
  //   });

  //   setSearchResults(filteredResults.reverse());
  // }, [posts, search, setSearchResults]);

  const handleSubmit=async (e)=>{
    e.preventDefault();
    const id=posts.length ? posts[posts.length -1].id+1:1;
    const datetime=format(new Date(), 'MMMM dd, yyyy pp');
    const newPost={id, title: postTitle, datetime, body: postBody};
    try{
      const response=await api.post('posts', newPost)
      //const allPosts=[...posts, newPost];
      const allPosts=[...posts, response.data ];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/')
    }catch(err){
      console.log(`Error:${err.message}`);
    }
  }

  const handleEdit=async(id)=>{
    const datetime=format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost={id, title:editTitle, datetime, body:editBody};
    try{
      const response=await api.put(`posts/${id}`, updatedPost)
      setPosts(posts.map(post=> post.id===id? {...response.data}: post));
      setEditTitle('');
      setEditBody('');
      navigate('/')
    }catch(err){
      console.log(`Error:${err.message}`);
    }
  }

  const handleDelete=async (id)=>{
    try{
      await api.delete(`posts/${id}`)
    const postsList=posts.filter(post=> post.id !==id);
    setPosts(postsList);
    navigate('/')
    }catch(err){
      console.log(`Error:${err.message}`);
    }
  }

  return (
    <div className="App">
      <Header
        title="Social-Media"
        width={width}
      />
      <Nav
        search={search}
        setSearch={setSearch}
      />
      <Routes>
        <Route path="/" element={<Home 
          posts={searchResults}
        />}/> 
        <Route path="post">
          <Route index element={<NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
          />} />
          
          <Route path=":id" element={<PostPage posts={posts} 
          handleDelete={handleDelete}
          />} />
        </Route>

        <Route path="/edit/:id" element={<EditPost posts={posts}
            handleEdit={handleEdit}
            editBody={editBody}
            setEditBody={setEditBody}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
          />}
          />

        <Route path="about" element={<About/>} />
        <Route path="*" element={<Missing/>} />
      </Routes>
      <Footer/>
      {/* <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/newpost">NewPost</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/newpost" element={<NewPost/>}/>
        <Route path="/postpage" element={<PostPage/>}/>
        <Route path="/missing" element={<Missing/>}/>
        <Route path="/footer" element={<Footer/>}/>
        
      </Routes> */}
    </div>
  );
}

export default App;

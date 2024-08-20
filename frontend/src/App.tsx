import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Button, Card, CardContent, Grid, AppBar, Toolbar, Modal, Box, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';

type Post = {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
};

const StyledHero = styled('div')(({ theme }) => ({
  backgroundImage: 'url(https://loremflickr.com/g/1200/400/crypto?lock=1)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  marginBottom: theme.spacing(4),
}));

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  width: '400px',
}));

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async (data: { title: string; body: string; author: string }) => {
    try {
      await backend.createPost(data.title, data.body, data.author);
      setIsModalOpen(false);
      reset();
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Crypto Blog</Typography>
        </Toolbar>
      </AppBar>
      <StyledHero>
        <Typography variant="h2">Welcome to Crypto Blog</Typography>
      </StyledHero>
      <Container>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen(true)}
          style={{ marginBottom: '20px' }}
        >
          Create New Post
        </Button>
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} key={Number(post.id)}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{post.title}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    By {post.author} on {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                  </Typography>
                  <Typography variant="body1">{post.body}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <StyledModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <Typography variant="h6" style={{ marginBottom: '20px' }}>
            Create New Post
          </Typography>
          <form onSubmit={handleSubmit(handleCreatePost)}>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: 'Title is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="body"
              control={control}
              defaultValue=""
              rules={{ required: 'Body is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Body"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="author"
              control={control}
              defaultValue=""
              rules={{ required: 'Author is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Author"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
              Submit
            </Button>
          </form>
        </ModalContent>
      </StyledModal>
    </>
  );
}

export default App;

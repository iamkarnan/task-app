import { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { useTasks } from './hooks/useTasks';
import { TaskStatus } from './types/tasks';
import './App.css';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  IconButton,
  Modal, 
  TextField, 
  MenuItem, 
  Select,  
  InputLabel, 
  FormControl, 
  FormHelperText,
  Snackbar, Alert 
} from "@mui/material";
import { Container, Row, Col } from 'react-bootstrap';
import { Edit, Delete, Add } from "@mui/icons-material";

function App() {
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const { tasks, fetchTasks, deleteTask, error, setError, createTask, updateTask } = useTasks();
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
  });
  const [editId, setEditId] = useState('');
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    status: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => filter === "all" || task.status === filter);


   const setEdit = (task) => {
      setFormData({ title: task.title, description: task.description, status: task.status }); 
    setErrors({ title: '', description: '', status: '' }); 
    setEditId(task._id);
    handleOpen();
   }

   const handleOpen = () => setOpen(true);


  const handleClose = () => {
    setOpen(false);
    setFormData({ title: '', description: '', status: '' }); 
    setErrors({ title: '', description: '', status: '' }); 
    setEditId('');
  };


  const validate = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!formData.title) {
      isValid = false;
      newErrors.title = 'Title is required';
    }

    if (!formData.description) {
      isValid = false;
      newErrors.description = 'Description is required';
    }

    if (!formData.status) {
      isValid = false;
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = async() => {
    if (validate()) {
      if(editId === ''){
        await createTask(formData);
      } else {
        await updateTask(editId, formData);
      }
      
      handleClose();
    }
  }

  return (
    <>
      <div className="text-center my-3">
        <h2>Task List</h2>
        <div className="my-3">
          <Button variant="contained" onClick={() => setFilter("all")} className="mx-2">
            All
          </Button>
          <Button variant="contained" onClick={() => setFilter(TaskStatus.PENDING)} className="mx-2">
            Pending
          </Button>
          <Button variant="contained" onClick={() => setFilter(TaskStatus.COMPLETED)} className="mx-2">
            Completed
          </Button>
          <Button variant="contained" onClick={() => setFilter(TaskStatus.IN_PROGRESS)} className="mx-2">
            In Progress
          </Button>
        </div>
      </div>

      <Row
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          overflowX: 'auto',
          gap: '20px', 
        }}
      >
        {filteredTasks.map((task) => (
          <Col key={task._id} className="d-flex justify-content-center" style={{ maxWidth: '300px' }}>
            <Card
              sx={{
                width: 300,
                height: 350, 
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                position: 'relative', 
                margin: '0 auto', 
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#4caf50", 
                  padding: "10px",
                  color: "white",
                  borderRadius: "8px 8px 0 0",
                }}
              >
                <Typography variant="h6" className="title">{task.title}</Typography>
                <Typography variant="subtitle1" className="status">{task.status}</Typography>
              </div>
              <CardContent
                sx={{
                  flexGrow: 1, 
                  paddingBottom: "50px", 
                }}
              >
                <Typography variant="body2">{task.description}</Typography>
              </CardContent>
              <CardActions
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  padding: "10px",
                  backgroundColor: "#f1f1f1",
                  width: '100%',
                  borderRadius: "0 0 8px 8px", 
                  justifyContent: "flex-end",
                }}
              >
                <IconButton color="primary" size="small" title="Edit" onClick={()=>setEdit(task)}>
                  <Edit />
                </IconButton>
                <IconButton color="secondary" size="small" title="Delete" onClick={()=>deleteTask(task._id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Col>
        ))}
      </Row>
       <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: 3
        }}
      >
        <Add sx={{ fontSize: 40 }} />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: 400,
          }}
        >
          <h2>Create New Task</h2>
          <form>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.title}
              helperText={errors.title}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
            />

            <FormControl fullWidth margin="normal" error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                label="Status"
              >
                <MenuItem className="menuItem" value={TaskStatus.PENDING}>Pending</MenuItem>
                <MenuItem className="menuItem" value={TaskStatus.IN_PROGRESS}>In-Progress</MenuItem>
                <MenuItem className="menuItem" value={TaskStatus.COMPLETED}>Completed</MenuItem>
              </Select>
              {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
            </FormControl>

            <Button
              type="button"
              onClick={onSubmit}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Submit
            </Button>
          </form>
        </div>
      </Modal>
       <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          message={error}
          severity="error"
        />
    </>
  );
}

export default App;

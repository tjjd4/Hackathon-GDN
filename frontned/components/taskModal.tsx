// src/components/TaskModal.js
import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './taskModal.css'; // Create this file to style the modal

const TaskModal = ({ show, handleClose, handleSave }) => {
  const [taskName, setTaskName] = useState('');

  const [taskTaskDescription, setTaskDescription] = useState('');
  const [peopleNumber, setPeopleNumber] = useState('');
  const [point, setPoint] = useState('');

  const onSave = () => {
    handleSave({ taskName, peopleNumber, point, taskTaskDescription });
    setTaskName('');
    setPeopleNumber('');
    setPoint('');
  };

  return (
    <Dialog.Root open={show} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Add New Task</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Fill in the details of the new task.
          </Dialog.Description>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="taskName">Task Name</label>
            <input className="Input" id="taskName" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          </fieldset>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="taskDescription">Task Description</label>
            <input className="Input" id="taskName" value={taskTaskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
          </fieldset>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="peopleNumber">People Number</label>
            <input className="Input" id="peopleNumber" type="number" value={peopleNumber} onChange={(e) => setPeopleNumber(e.target.value)} />
          </fieldset>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="point">Point</label>
            <input className="Input" id="point" type="number" value={point} onChange={(e) => setPoint(e.target.value)} />
          </fieldset>
          <div className="DialogButtons">
            <button className="Button green" onClick={onSave}>Save Task</button>
            <button className="Button red" onClick={handleClose}>Cancel</button>
          </div>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TaskModal;

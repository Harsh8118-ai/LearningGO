import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useAuth } from "../store/UseAuth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function QuestionModal({ open, setOpen, question }) {
  const { user } = useAuth();
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    if (question) {
      fetchAnswers();
    }
  }, [question]);

  const fetchAnswers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/questions/${question._id}/answers`);
      const data = await response.json();
      setAnswers(data);
    } catch (error) {
      console.error("Failed to fetch answers", error);
    }
  };

  const handleAddAnswer = async () => {
    if (!newAnswer.trim()) return;
    try {
      const response = await fetch(`${BASE_URL}/questions/${question._id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newAnswer, user: user.username }),
      });
      if (response.ok) {
        fetchAnswers();
        setNewAnswer("");
      }
    } catch (error) {
      console.error("Failed to add answer", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{question?.question}</DialogTitle>
          <p className="text-sm text-gray-400">Asked by {question?.username}</p>
        </DialogHeader>
        <div className="space-y-4">
          {answers.map((answer, index) => (
            <div key={index} className="p-3 bg-gray-800 rounded-md">
              <p className="text-white">{answer.text}</p>
              <p className="text-xs text-gray-400">- {answer.user}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <textarea
            className="w-full p-2 bg-gray-900 text-white rounded-md"
            placeholder="Write your answer..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleAddAnswer}>Submit Answer</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

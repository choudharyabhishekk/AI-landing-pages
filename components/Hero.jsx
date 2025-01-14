"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserContext } from "@/context/UserContext";
import Lookup from "@/data/Lookup";
import { ArrowRight } from "lucide-react";
import { useContext, useState } from "react";
import Login from "./LoginDialog";

export default function Hero() {
  const [userInput, setUserInput] = useState();
  const [openDialog, setOpenDialog] = useState(false);

  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserContext);
  const userPrompt = (input) => {
    setMessages({ role: "user", content: input });
  };
  return (
    <div className="flex flex-col items-center mt-24 gap-2 ">
      <h1 className="text-4xl font-bold">
        Generate Landing Pages with the <br />
        Power of AI
      </h1>
      <div className="flex p-5 border rounded-xl w-full max-w-xl mt-5">
        <textarea
          className="outline-none bg-transparent w-full h-32 max-h-64 resize-none"
          placeholder="What do you want to build?"
          onChange={(e) => setUserInput(e.target.value)}
        ></textarea>
        <ArrowRight
          onClick={(e) => {
            if (!userDetail?.name) {
              setOpenDialog(true);
              return;
            }
            userPrompt(userInput);
          }}
          className="bg-blue-500 p-2 h-8 w-8 rounded-md cursor-pointer"
        />
      </div>
      <div className="flex mt-8 flex-wrap max-2-2xl items-center justify-center gap-3 max-w-2xl">
        {Lookup?.SUGGSTIONS.map((suggestions, index) => (
          <h2
            onClick={() => userPrompt(suggestions)}
            key={index}
            className="p-1 px-2 border rounded-full text-sm text=gray-400 hover:text=white  cursor-pointer"
          >
            {suggestions}
          </h2>
        ))}
      </div>
      <Login
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(false)}
      />
    </div>
  );
}

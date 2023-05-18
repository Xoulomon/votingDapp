import Image from "next/image";
import Research from "./assets/research.jpeg";
import Operation from "./assets/operation.jpeg";
import ContractABI from "./ContractABI";
import { ethers } from "ethers";
import { useState } from "react";
import { useSnackbar } from "notistack";

const VoteForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const contractAddress = "0x01e9e7dc13bd6ab7cbb74d0c4674a0e545cc8a37";

  const [value, setValue] = useState("");

  const [addr, setAddr] = useState("");

  const handleInput = (event) => {
    const inputValue = event.target.checked ? event.target.value : "";
    setValue(inputValue);
    console.log(inputValue);
  };

  const handleAddr = (event) => {
    const inputAddress = event.target.value ;
    setAddr(inputAddress);
  };

  const winningCandidate = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const votingContract = new ethers.Contract(
        contractAddress,
        ContractABI,
        signer
      );
      const winningName = await votingContract.winningName();
      const convertByte = ethers.utils.parseBytes32String(winningName);

      console.log(convertByte);
      enqueueSnackbar(convertByte + " Project Is Leading", {
        variant: "success",
      });
    } catch (error) {
      console.log("Error Message: ", error.data);
    }
  };

  const voteCandidate = async (event) => {
    event.preventDefault();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      let receipt;
      const votingContract = new ethers.Contract(
        contractAddress,
        ContractABI,
        signer
      );
      const voterInfo = await votingContract.voters(address);
      const hasVoted = voterInfo.anyvotes;
      console.log(hasVoted);

      if (hasVoted) {
        console.log("Already voted");
      } else {
        // Process the vote
        console.log("Voting...");
      }

      // Proceed with voting
      const transaction = await votingContract.vote(value);

      receipt = await wait(transaction);

      console.log("Vote submitted successfully!");
      enqueueSnackbar("Vote Successful", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.data.message, { variant: "error" });
      console.log("Failed, reason: ", error.data.message);
    }
  };

  const delegateVote = async (event) => {
    event.preventDefault();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const votingContract = new ethers.Contract(
        contractAddress,
        ContractABI,
        signer
      );
      const delegateInfo = await votingContract.voters(delegate_addr);
      const delegateeInfo = await votingContract.voters(address);

      if (delegateeInfo.value == 0) {
        console.log("You have no voting right");
        enqueueSnackbar("You have no voting right", { variant: "warning" });
      } else if (delegateeInfo.anyvotes) {
        console.log("You have already voted");
        enqueueSnackbar("You have already voted", { variant: "warning" });
      } else if (delegateInfo.anyvotes) {
        console.log("You can not delegate voting right to who has voted already");
        enqueueSnackbar("You can not delegate voting right to who has voted already", { variant: "warning" });
      } else{
        console.log("Delegating Vote...");
        enqueueSnackbar("Delegating Vote...", { variant: "info" });
      }

      const delegVote = await votingContract.delegateRightToVote(addr);

      receipt = await wait(delegVote);

      console.log("Delegated voting right successfully!");
      enqueueSnackbar("Voting Right Delegation Successful", { variant: "success" });
    } catch (error) {
      console.log("Error Message: ", error.data);
    }
  };

  return (
    <>
      <span className="flex items-center justify-center">
        <h1 className="text-3xl font-bold text-[#0a61a4]">The Voting Form</h1>
      </span>
      <div className="flex flex-col md:flex-row bg-white py-8 px-4">
        <div className="md:w-1/2 bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Research Projects
            </h3>
          </div>
          <div className="flex justify-center">
            <Image
              src={Research}
              alt="Placeholder image"
              className="rounded-lg mb-4"
            />
          </div>
          <p className="text-gray-600 leading-relaxed">
            With Research Projects, we aim to foster innovation and explore new
            frontiers. Members can vote on proposals that focus on
            groundbreaking research initiatives, seeking to push the boundaries
            of knowledge in our industry. By supporting Research Projects, we
            invest in the future and nurture a culture of discovery within our
            organization.
          </p>
        </div>

        <div className="md:w-1/2 bg-white rounded-lg shadow-lg p-8 mt-4 md:mt-0 md:ml-4">
          <div className="flex justify-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Operational Expenses
            </h3>
          </div>
          <div className="flex justify-center">
            <Image
              src={Operation}
              alt="Placeholder image"
              className="rounded-lg mb-4"
              height={300}
              width={400}
            />
          </div>
          <p className="text-gray-600 leading-relaxed">
            Operational Expenses play a critical role in the day-to-day
            functioning of our organization. Voting on Operational Expenses
            proposals enables members to make decisions regarding the allocation
            of resources for essential activities such as infrastructure,
            staffing, and logistical needs. These decisions directly impact our
            operational efficiency and sustainability.
          </p>
        </div>
      </div>

      <div className="flex justify-center py-4 px-8 mt-4">
        <div class="md:w-1/2 md:pr-4" >
        <form onSubmit={delegateVote}>
        <input type="text" name="delegVote" id="delegVote" placeholder="Enter address to delegate vote" required onChange={handleAddr}/>
        <button
            type="submit"
            className="bg-gray-800 text-gray-300 py-2 px-4 rounded-lg"
          >
            Delegate Vote
          </button>
        </form> 
        </div>
        <form onSubmit={voteCandidate}>
          <label className="block mb-4">
            <input
              type="radio"
              name="option"
              value="0"
              className="mr-2"
              onChange={handleInput}
            />
            Proposal One
          </label>
          <label className="block mb-4">
            <input
              type="radio"
              name="option"
              value="1"
              className="mr-2"
              onChange={handleInput}
            />
            Proposal Two
          </label>
           <label className="block mb-4">
            <input
              type="radio"
              name="option"
              value="2"
              className="mr-2"
              onChange={handleInput}
            />
            Proposal Three
          </label>
           <label className="block mb-4">
            <input
              type="radio"
              name="option"
              value="3"
              className="mr-2"
              onChange={handleInput}
            />
            Proposal Four
          </label>
           <label className="block mb-4">
            <input
              type="radio"
              name="option"
              value="4"
              className="mr-2"
              onChange={handleInput}
            />
            Proposal Five
          </label>
           <label className="block mb-4">
            <input
              type="radio"
              name="option"
              value="5"
              className="mr-2"
              onChange={handleInput}
            />
            Proposal Six
          </label>
          <button
            type="submit"
            className="bg-gray-800 text-gray-300 py-2 px-4 rounded-lg"
          >
            Vote Now
          </button>
        </form>
      </div>

     <div className="flex justify-end mt-4 mr-4">
        <button
          className="bg-gray-800 text-gray-300 py-2 px-4"
          onClick={winningCandidate}
        >
          Check Election Result
        </button>
      </div> 
    </>
  );
};

export default VoteForm;
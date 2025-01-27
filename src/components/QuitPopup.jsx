export default function QuitPopup({ message, onConfirm, onCancel }) {
  return (
    <>
      <div className="font-medieval top-0 left-0 flex items-center justify-center h-screen w-screen absolute z-50">
        <div className="bg-black/90 rounded-lg p-6 shadow-lg text-center w-[300px] md:w-[400px]">
          <p className="text-lg text-[#64ffda] font-bold mb-4">{message}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Yes, Quit
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

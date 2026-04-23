// import React from 'react'
// import {modalStyles, modelstyles} from '../assets/dummyStyles.js'

// const AddTransactionModal = ({
//   showModal,
//   setShowModal,
//   newTransaction,
//   setNewTransaction,
//   handleAddTransaction,
//   type = "both",
//   title = "Add New Transaction",
//   buttonText = "Add Transaction",
//   categories = ["Food", "Housing", "Transport", "Shopping", "Entertainment", "Utilities", "Healthcare", "Salary", "Freelance", "Investments","Bonus" , "Other"],
//   color = "teal"
// }) => {}
//   if (!showModal) return null;

//   // Get current date in YYYY-MM-DD format
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const currentDate = today.toISOString().split('T')[0];
//   const minDate = `${currentYear}-01-01`;

//   const colorClass = modalStyles.colorClasses[color];

// }
//   return (
//     <div className={modalstyles.overlay}>
//         <div className={modalstyles.modalContainer}>
//             <div className={modalstyles.modalHeader}>
//                 <h2 className={modalstyles.modalTitle}>{title}</h2>
//                 <button onClick={() => setShowModal(false)} className={modalstyles.closeButton}>
//                     <x size={24} />
//                 </button>
//             </div>
//             <form onSubmit={(e) => {
//                 e.preventDefault();
//                 handleAddTransaction();
//             }}>
//                 <div className={modalStyles.form}>
//                     <div>
//                         <label className={modalStyles.label}>Description</label>
//                         <input type="text" value={newTransaction.description} onChange={(e) => setNewTransaction((prev) => ({
//                             ...prev,
//                             description: e.target.value,
//                         }))} className={modalStyles.input(colorClass.ring)} placeholder={type === "both" ? "Salary, Funds, etc.": "Groceries, Rent, etc."} required />
//                     </div>

//                        <div>
//                         <label className={modalStyles.label}>Amount</label>
//                         <input type="number" value={newTransaction.amount} onChange={(e) => setNewTransaction((prev) => ({
//                             ...prev,
//                             amount: parseFloat(e.target.value) || 0,
//                         }))} className={modalStyles.input(colorClass.ring)} placeholder="0.00" required />
//                     </div>

//                         {type === "both" && (
//               <div>
//                 <label className={modalStyles.label}>Type</label>
//                 <div className={modalStyles.typeButtonContainer}>
//                   <button 
//                     type="button"
//                     className={modalStyles.typeButton(
//                       newTransaction.type === 'income', 
//                       modalStyles.colorClasses.teal.typeButtonSelected
//                     )}
//                     onClick={() => setNewTransaction(prev => ({...prev, type: 'income'}))}
//                   >
//                     Income
//                   </button>
//                   <button 
//                     type="button"
//                     className={modalStyles.typeButton(
//                       newTransaction.type === 'expense', 
//                       modalStyles.colorClasses.orange.typeButtonSelected
//                     )}
//                     onClick={() => setNewTransaction(prev => ({...prev, type: 'expense'}))}
//                   >
//                     Expense
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div>
//                         <label className={modalStyles.label}>Category</label>
//                         <select value={newTransaction.category}
//                         onChange={(e) => setNewTransaction((prev)=> ({
//                             ...prev,
//                             category: e.target.value
//                         }))
//                         }
//                         className={modalStyles.input(colorClass.ring)} required>
//                             {categories.map((cat) => (
//                                 <option key={cat} value={cat}>
//                                     {cat}
//                                 </option>
//                             ))}
//                         </select>
//             </div>
//             <div>
//                         <label className={modalStyles.label}>Date</label>
//                         <input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction((prev) => ({
//                             ...prev,
//                             date: e.target.value,
//                         }))} className={modalStyles.input(colorClass.ring)} min={minDate} max={currentDate} required />
//             </div>
//             <button type="submit" className={modalStyles.submitButton(colorClass.button)}>
//                 {buttonText}
//             </button>
//                 </div>
//             </form>
//         </div>
//     </div>
//   )
// };

// export default AddTransactionModal





































import React from "react";
import { modalStyles } from "../assets/dummyStyles.js";
import { X } from "lucide-react";

const AddTransactionModal = ({
  showModal,
  setShowModal,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  type = "both",
  title = "Add New Transaction",
  buttonText = "Add Transaction",
  categories = [
    "Food",
    "Housing",
    "Transport",
    "Shopping",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Salary",
    "Freelance",
    "Investments",
    "Bonus",
    "Other",
  ],
  color = "teal",
}) => {
  if (!showModal) return null;

  // ✅ Date logic
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentDate = today.toISOString().split("T")[0];
  const minDate = `${currentYear}-01-01`;

  // ✅ Safe color access
  const colorClass = modalStyles?.colorClasses?.[color] || {};

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.modalContainer}>

        {/* Header */}
        <div className={modalStyles.modalHeader}>
          <h2 className={modalStyles.modalTitle}>{title}</h2>
          <button
            onClick={() => setShowModal(false)}
            className={modalStyles.closeButton}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTransaction();
          }}
        >
          <div className={modalStyles.form}>

            {/* Description */}
            <div>
              <label className={modalStyles.label}>Description</label>
              <input
                type="text"
                value={newTransaction.description || ""}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className={modalStyles.input(colorClass.ring)}
                placeholder={
                  type === "both"
                    ? "Salary, Freelance, etc."
                    : "Groceries, Rent, etc."
                }
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className={modalStyles.label}>Amount</label>
              <input
                type="number"
                value={newTransaction.amount || ""}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                }
                className={modalStyles.input(colorClass.ring)}
                placeholder="0.00"
                required
              />
            </div>

            {/* Type */}
            {type === "both" && (
              <div>
                <label className={modalStyles.label}>Type</label>
                <div className={modalStyles.typeButtonContainer}>
                  <button
                    type="button"
                    className={modalStyles.typeButton(
                      newTransaction.type === "income",
                      modalStyles.colorClasses.teal.typeButtonSelected
                    )}
                    onClick={() =>
                      setNewTransaction((prev) => ({
                        ...prev,
                        type: "income",
                      }))
                    }
                  >
                    Income
                  </button>

                  <button
                    type="button"
                    className={modalStyles.typeButton(
                      newTransaction.type === "expense",
                      modalStyles.colorClasses.orange.typeButtonSelected
                    )}
                    onClick={() =>
                      setNewTransaction((prev) => ({
                        ...prev,
                        type: "expense",
                      }))
                    }
                  >
                    Expense
                  </button>
                </div>
              </div>
            )}

            {/* Category */}
            <div>
              <label className={modalStyles.label}>Category</label>
              <select
                value={newTransaction.category || ""}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className={modalStyles.input(colorClass.ring)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className={modalStyles.label}>Date</label>
              <input
                type="date"
                value={newTransaction.date || currentDate}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className={modalStyles.input(colorClass.ring)}
                min={minDate}
                max={currentDate}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={modalStyles.submitButton(colorClass.button)}
            >
              {buttonText}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
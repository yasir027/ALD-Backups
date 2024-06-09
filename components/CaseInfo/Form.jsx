import React from "react";
import Styles from "./Form.module.css";
import Dash from "./Dash";

import Table from "./Table";
// Ensure this import points to the correct file

function Form() {
  return (
    <div className={Styles.Container}>
      <Dash />
      
        <div className={Styles.formContainer}>
          <div className={Styles.formHeader}>
            <h1>
              <i>Case Information</i>
            </h1>
          </div>
          <div className="formBody">
            <div className={Styles.row}>
              <div className={Styles.col}>
                
                <input
                  type="text"
                  className={Styles.CIinput}
                  placeholder="Court Name"
                />
              </div>
              <div className={Styles.col}>
                
                <input
                  type="date"
                  className={Styles.CIinput}
                  placeholder="Enter Date"
                />
              </div>
              <div className={Styles.col}>
                
                <input
                  type="text"
                  className={Styles.CIinput}
                  placeholder="Judge Name"
                />
              </div>
            </div>
            <div className={Styles.row}>
              <div className={Styles.col}>
                
                <input
                  type="text"
                  className={Styles.CIinput}
                  placeholder="Case Type"
                />
              </div>
              <div className={Styles.col}>
               
                <input
                  type="number"
                  className={Styles.CIinput}
                  placeholder="Case Number"
                />
              </div>
              <div className={Styles.col}>
                
                <input
                  type="year"
                  className={Styles.CIinput}
                  placeholder="Case Year"
                />
              </div>
            </div>
            <div className={Styles.row}>
              <div className={Styles.col}>
                
                <input
                  type="text"
                  className={Styles.CIinput}
                  placeholder="Name of Parties"
                />
              </div>
            </div>
            <div className={Styles.row}>
              <div className={Styles.col}>
                
                <input
                  type="text"
                  className={Styles.CIinput}
                  placeholder="Citations"
                />
              </div>
            </div>
            <div className={Styles.row}>
              <div className={Styles.col}>
                <label>From</label>
                <input
                  type="date"
                  className={Styles.CIinput}
                  placeholder="Enter Name"
                />
              </div>
              <div className={Styles.col}>
                <label>To</label>
                <input
                  type="date"
                  className={Styles.CIinput}
                  placeholder="Enter Date"
                />
              </div>
              
            </div>
            <div className={Styles.row}>
            <div className={Styles.col}>
              <label>Status</label>
              <input
                type="text"
                className={Styles.CIinput}
                placeholder="Remarks"
              />
            </div>
            </div>
            <div className={Styles.row}>
              <div className={Styles.club}>
                <div className={Styles.button}>Add</div>
                <div className={Styles.button}>Update</div>
              </div>
              <div className={Styles.club}>
                <div className={Styles.button}>Refresh</div>
                <div className={Styles.button}>Clear</div>
              </div>
              <div className={Styles.club}>
                <div className={Styles.button}>Search</div>
                <div className={Styles.button1}>🗑</div>
              </div>
            </div>
               <Table />
          </div>
        </div>
      </div>
   
  );
}

export default Form;

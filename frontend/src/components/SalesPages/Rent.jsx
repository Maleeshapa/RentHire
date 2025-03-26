
// import React, { useState, useEffect, useCallback } from "react";
// import './Hire.css';
// import { User, CarFront } from "lucide-react";
// import { Link } from "react-router-dom";
// import CusNicSuggest from './CusNicSuggest';
// import GNicSuggest from './GNicSuggest';
// import config from "../../config";
// import Form from "../../Models/Form/Form";
// import GuarantorForm from '../../Models/Gurantor/GurantorForm';  
// import Modal from 'react-modal';

// const Rent = ({ onSubmit }) => {

//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [selectedCus, setSelectedCus] = useState(null);

//     const [guarantorModalIsOpen, setGuarantorModalIsOpen] = useState(false);
//     const [selectedGuarantor, setSelectedGuarantor] = useState(null);

//     const openModal = () => {
//         setSelectedCus(null);
//         setModalIsOpen(true);
//     };

//     const closeModal = () => {
//         setModalIsOpen(false);

//     };

//     const openGuarantorModal = () => {
//         setSelectedGuarantor(null);
//         setGuarantorModalIsOpen(true);
//     };

//     const closeGuarantorModal = () => {
//         setGuarantorModalIsOpen(false);
//     };



//     const [customerData, setCustomerData] = useState({
//         cusId: '',
//         nic: '',
//         license: '',
//         cusName: '',
//         cusAddress: '',
//         cusPhone: ''
//     });

//     const [guarantorData, setGuarantorData] = useState({
//         guarantorId: '',
//         nic: '',
//         guarantorName: '',
//         guarantorPhone: '',
//         guarantorAddress: ''
//     });

//     const [vehicles, setVehicles] = useState([]);
//     const [selectedVehicle, setSelectedVehicle] = useState({
//         productId: '',
//         productName: '',
//         productCode: '',
//         productSellingPrice: ''
//     });

//     const [tableData, setTableData] = useState([]);
//     const [drivers, setDrivers] = useState([]);
//     const [selectedDriver, setSelectedDriver] = useState('');

//     const [extraCharges, setExtraCharges] = useState(0);
//     const [paymentMethod, setPaymentMethod] = useState('');
//     const [paidAmount, setPaidAmount] = useState(0);
//     const [cashierName, setCashierName] = useState('');
//     const [note, setNote] = useState('');
//     const [paymentType, setPaymentType] = useState('');

//     useEffect(() => {

//         // const fetchHireVehicles = async () => {
//         //     try {
//         //         const response = await fetch(`${config.BASE_URL}/products`);
//         //         if (!response.ok) throw new Error(`Failed to fetch vehicles: ${response.status} ${response.statusText}`);
//         //         const data = await response.json();
//         //         setVehicles(data.filter(vehicle => vehicle.rentOrHire === 'rent'));
//         //     } catch (error) {
//         //         console.error('Error fetching hire vehicles:', error);
//         //     }
//         // };

//         const fetchHireVehicles = async () => {
//             try {
//                 const response = await fetch(`${config.BASE_URL}/products/getRentProducts`);
//                 if (!response.ok) throw new Error(`Failed to fetch vehicles: ${response.status} ${response.statusText}`);
//                 const data = await response.json();
//                 setVehicles(data.filter(vehicle => vehicle.rentOrHire === 'rent'));
//             } catch (error) {
//                 console.error('Error fetching hire vehicles:', error);
//             }
//         };

//         const fetchDrivers = async () => {
//             try {
//                 const response = await fetch(`${config.BASE_URL}/getAllDrivers`);
//                 if (!response.ok) throw new Error(`Failed to fetch drivers: ${response.status} ${response.statusText}`);
//                 const data = await response.json();
//                 setDrivers(data);
//             } catch (error) {
//                 console.error('Error fetching drivers:', error);
//             }
//         };

//         fetchHireVehicles();
//         fetchDrivers();
//     }, []);

//     const handleSelectCustomer = useCallback((customer) => {
//         setCustomerData({
//             cusId: customer.cusId,
//             nic: customer.nic,
//             license: customer.license || '',
//             cusName: customer.cusName || '',
//             cusAddress: customer.cusAddress || '',
//             cusPhone: customer.cusPhone || ''
//         });
//     }, []);

//     const handleSelectGuarantor = useCallback((guarantor) => {
//         setGuarantorData({
//             guarantorId: guarantor.guarantorId,
//             nic: guarantor.nic,
//             guarantorName: guarantor.guarantorName || '',
//             guarantorPhone: guarantor.guarantorPhone || '',
//             guarantorAddress: guarantor.guarantorAddress || ''
//         });
//     }, []);

//     const handleVehicleSelect = useCallback((e) => {
//         const selectedId = e.target.value;
//         const selected = vehicles.find(vehicle => vehicle.productId === parseInt(selectedId));
//         if (selected) {
//             setSelectedVehicle({
//                 productId: selected.productId,
//                 productName: selected.productName,
//                 productCode: selected.productCode,
//                 productSellingPrice: selected.productSellingPrice
//             });
//         }
//     }, [vehicles]);

//     const handleDriverSelect = useCallback((e) => {
//         setSelectedDriver(e.target.value);
//     }, []);

//     const handleAdd = useCallback(() => {
//         const newRow = {
//             customerName: customerData.cusName,
//             customerNIC: customerData.nic,
//             guarantorName: guarantorData.guarantorName,
//             guarantorNIC: guarantorData.nic,
//             vehicleName: selectedVehicle.productName,
//             numberPlate: selectedVehicle.productCode,
//             hirePrice: selectedVehicle.productSellingPrice
//         };
//         setTableData([...tableData, newRow]);
//     }, [customerData, guarantorData, selectedVehicle, tableData]);

//     const handleRemoveRow = useCallback((index) => {
//         setTableData(tableData.filter((_, i) => i !== index));
//     }, [tableData]);



//     const handleCreate = async () => {
//         try {

//             if (!customerData.cusId) {
//                 alert('Please select a customer');
//                 return;
//             }
//             // if (!guarantorData.guarantorId) {
//             //     alert('Please select a guarantor');
//             //     return;
//             // }
//             if (!selectedVehicle.productId) {
//                 alert('Please select a vehicle');
//                 return;
//             }


//             const totalAmount = Number(selectedVehicle.productSellingPrice) + Number(extraCharges);

//             const saleData = {
//                 customerId: customerData.cusId,
//                 guarantorId: guarantorData.guarantorId || null,
//                 productId: selectedVehicle.productId,
//                 saleDate: new Date().toISOString(),
//                 cashierName,
//                 driverId: selectedDriver || null,
//                 note,
//                 price: Number(selectedVehicle.productSellingPrice),
//                 extraCharges: Number(extraCharges),
//                 totalAmount,
//                 paymentType,
//                 paidAmount: Number(paidAmount),
//                 due: Math.max(0, totalAmount - Number(paidAmount))
//             };

//             const response = await fetch(`${config.BASE_URL}/hireCreate`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(saleData)
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to create Rent');
//             }

//             const result = await response.json();
//             alert('Rent is Done!');
//             setCustomerData({ cusId: '', nic: '', license: '', cusName: '', cusAddress: '', cusPhone: '' });
//             setGuarantorData({ guarantorId: '', nic: '', guarantorName: '', guarantorPhone: '', guarantorAddress: '' });
//             setSelectedVehicle({ productId: '', productName: '', productCode: '', productSellingPrice: '' });
//             setSelectedDriver('');
//             setCashierName('');
//             setNote('');
//             setPaymentType('');
//             setPaidAmount(0);
//             setExtraCharges(0);
//             setTableData([]);
//         } catch (error) {
//             console.error('Error creating Rent:', error);
//             alert(`Failed to create Rent: ${error.message}`);
//         }
//     };

//     return (
//         <div className="container-fluid p-5">
//             <div className="row">
//                 <div className="col-md-4 col-sm-12 border-end">
//                     <div className="d-flex justify-content-between align-items-center mb-2">
//                         <h5 className="d-flex align-items-center">
//                             <User className="me-2" /> Customer Details
//                         </h5>
//                         {/* <Link to="/customer/customer-list">
//                             <button className="btn btn-primary btn-sm">+ New Customer</button>
//                         </Link> */}
//                         <button className="btn btn-primary btn-sm" onClick={openModal}>+ New Customer</button>
//                     </div>

//                     <CusNicSuggest onSelectCustomer={handleSelectCustomer} />

//                     <input
//                         type="text"
//                         className="form-control mb-2  bg-light"
//                         placeholder="Customer Licence"
//                         value={customerData.license}
//                         readOnly
//                     />
//                     <input
//                         type="text"
//                         className="form-control mb-2  bg-light"
//                         placeholder="Customer Name"
//                         value={customerData.cusName}
//                         readOnly
//                     />
//                     <input
//                         type="text"
//                         className="form-control mb-2  bg-light bg-light"
//                         placeholder="Customer Address"
//                         value={customerData.cusAddress}
//                         readOnly
//                     />
//                     <input
//                         type="text"
//                         className="form-control mb-2  bg-light"
//                         placeholder="Customer Phone"
//                         value={customerData.cusPhone}
//                         readOnly
//                     />
//                 </div>

//                 <div className="col-md-4 col-sm-12  border-end">
//                     <div className="d-flex justify-content-between align-items-center mb-2">
//                         <h5 className="d-flex align-items-center">
//                             <i className="bi bi-person-raised-hand me-2" style={{ fontSize: '20px' }}></i>  Guarantor Details
//                         </h5>
//                         {/* <Link to="/gurantor">
//                             <button className="btn btn-primary btn-sm">+ New Guarantor</button>
//                         </Link> */}
//                         <button className="btn btn-primary btn-sm" onClick={openGuarantorModal}>+ New Guarantor</button>
//                     </div>

//                     <GNicSuggest onSelectGuarantor={handleSelectGuarantor} />

//                     <input
//                         type="text"
//                         className="form-control mb-2 bg-light"
//                         placeholder="Guarantor Name"
//                         value={guarantorData.guarantorName}
//                         readOnly
//                     />
//                     <input
//                         type="text"
//                         className="form-control mb-2 bg-light"
//                         placeholder="Guarantor Phone"
//                         value={guarantorData.guarantorPhone}
//                         readOnly
//                     />
//                     <input
//                         type="text"
//                         className="form-control mb-2 bg-light"
//                         placeholder="Guarantor Address"
//                         value={guarantorData.guarantorAddress}
//                         readOnly
//                     />
//                 </div>

//                 <div className="col-md-4  col-sm-12 ">
//                     <div className="d-flex justify-content-between align-items-center mb-2">
//                         <h5 className="d-flex align-items-center">
//                             <CarFront className="me-2" />Rent Vehicle Details
//                         </h5>
//                         <Link to="/product/product-list">
//                             <button className="btn btn-primary btn-sm">+ New Rent Vechicle</button>
//                         </Link>
//                     </div>
//                     <select
//                         className="form-control mb-2"
//                         onChange={handleVehicleSelect}
//                         value={selectedVehicle.productId}
//                     >
//                         <option value="">Select Vehicle</option>
//                         {vehicles.map(vehicle => (
//                             <option key={vehicle.productId} value={vehicle.productId}>
//                                 {vehicle.productName}
//                             </option>
//                         ))}
//                     </select>

//                     <input
//                         type="text"
//                         className="form-control mb-2 d-none"
//                         placeholder="Vehicle Name"
//                         value={selectedVehicle.productName}
//                         readOnly
//                     />

//                     <input
//                         type="text"
//                         className="form-control mb-2"
//                         placeholder="Number Plate"
//                         value={selectedVehicle.productCode}
//                         readOnly
//                     />
//                     <input
//                         type="text"
//                         className="form-control mb-2"
//                         placeholder="Rent Price"
//                         value={selectedVehicle.productSellingPrice}
//                         onChange={(e) =>
//                             setSelectedVehicle({ ...selectedVehicle, productSellingPrice: e.target.value })
//                         }
//                     />

//                 </div>
//             </div>

//             <div className="d-flex justify-content-end">
//                 <button className="btn btn-primary mt-3" onClick={handleAdd}>Add</button>
//             </div>

//             <div className="table-responsive mt-3">
//                 <table className="table table-bordered">
//                     <thead>
//                         <tr>
//                             <th>Customer Name</th>
//                             <th>Customer NIC</th>
//                             <th>Guarantor Name</th>
//                             <th>Guarantor NIC</th>
//                             <th>Vehicle Name</th>
//                             <th>Number Plate</th>
//                             <th>Rent Price</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {tableData.map((row, index) => (
//                             <tr key={index}>
//                                 <td>{row.customerName}</td>
//                                 <td>{row.customerNIC}</td>
//                                 <td>{row.guarantorName}</td>
//                                 <td>{row.guarantorNIC}</td>
//                                 <td>{row.vehicleName}</td>
//                                 <td>{row.numberPlate}</td>
//                                 <td>{row.hirePrice}</td>
//                                 <td>
//                                     <button
//                                         className="btn btn-danger btn-sm p-2"
//                                         onClick={() => handleRemoveRow(index)}
//                                     >
//                                         -
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>

//                 </table>
//             </div>

//             <div className="row mt-3">
//                 {/* Left Section */}
//                 <div className="col-md-6">
//                     <label>Today's Date</label>
//                     <input type="text" className="form-control mb-2" value={new Date().toLocaleString()} readOnly />

//                     <label>Cashier</label>
//                     <input
//                         type="text"
//                         className="form-control mb-2"
//                         placeholder="Cashier Name"
//                         value={cashierName}
//                         onChange={(e) => setCashierName(e.target.value)}
//                     />

//                     {/* <label>Driver Select</label>
//                     <select className="form-control mb-2" onChange={handleDriverSelect} value={selectedDriver}>
//                         <option value="">Select Driver</option>
//                         {drivers.map(driver => (
//                             <option key={driver.id} value={driver.id}>
//                                 {driver.driverName} - {driver.driverNic}
//                             </option>
//                         ))}
//                     </select> */}


//                     <label>Upload Images</label>
//                     <input
//                         type="file"
//                         className="form-control mb-2"
//                         multiple
//                         accept="image/*"

//                     />

//                     {/* Display Selected Files */}
//                     {/* {selectedFiles.length > 0 && (
//                                 <div className="mt-2">
//                                     <strong>Selected Files:</strong>
//                                     <ul className="list-unstyled">
//                                         {selectedFiles.map((file, index) => (
//                                             <li key={index}>{file.name}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )} */}
//                 </div>

//                 {/* Right Section */}
//                 <div className="col-md-6">
//                     <label>Rent Price</label>
//                     <input
//                         type="number"
//                         className="form-control mb-2"
//                         value={selectedVehicle.productSellingPrice}
//                         onChange={(e) => setSelectedVehicle({ ...selectedVehicle, productSellingPrice: e.target.value })}
//                     />

//                     <label>Extra Charges</label>
//                     <input
//                         type="number"
//                         className="form-control mb-2"
//                         value={extraCharges}
//                         onChange={(e) => setExtraCharges(e.target.value)}
//                     />

//                     <label>Total Amount</label>
//                     <input
//                         type="number"
//                         className="form-control mb-2"
//                         value={Number(selectedVehicle.productSellingPrice) + Number(extraCharges)}
//                         readOnly
//                     />



//                     <div className="d-flex gap-2 mt-2">
//                         <button
//                             className={`btn ${paymentType === 'cash' ? 'btn-dark' : 'btn-secondary'}`}
//                             onClick={() => setPaymentType('cash')}
//                         >
//                             Cash
//                         </button>
//                         <button
//                             className={`btn ${paymentType === 'pay_later' ? 'btn-dark' : 'btn-secondary'}`}
//                             onClick={() => setPaymentType('pay_later')}
//                         >
//                             Pay Later
//                         </button>
//                         <button
//                             className={`btn ${paymentType === 'online' ? 'btn-dark' : 'btn-secondary'}`}
//                             onClick={() => setPaymentType('online')}
//                         >
//                             Online Payment
//                         </button>
//                     </div>

//                     {paymentType && (
//                         <>
//                             <label className="mt-2">Paid Amount</label>
//                             <input
//                                 type="number"
//                                 className="form-control mb-2"
//                                 value={paidAmount}
//                                 onChange={(e) => setPaidAmount(e.target.value)}
//                             />

//                             {/* <label>Extra Charges</label>
//                 <input
//                     type="number"
//                     className="form-control mb-2"
//                     value={extraCharges}
//                     onChange={(e) => setExtraCharges(e.target.value)}
//                 /> */}

//                             <label>Due</label>
//                             <input
//                                 type="number"
//                                 className="form-control mb-2"
//                                 value={Math.max(0, (Number(selectedVehicle.productSellingPrice) + Number(extraCharges)) - Number(paidAmount))}
//                                 readOnly
//                             />
//                         </>
//                     )}

//                     <label>Note</label>
//                     <textarea
//                         className="form-control mb-2"
//                         placeholder="Note"
//                         value={note}
//                         onChange={(e) => setNote(e.target.value)}
//                     ></textarea>

//                 </div>
//             </div>


//             <div className="mt-3 justify-content-end d-flex">
//                 <button className="btn btn-danger me-2">Cancel</button>
//                 {/* <button className="btn btn-primary" onClick={handleCreate} >Create</button> */}

//                 <button
//                     className="btn btn-primary me-2"
//                     disabled={!paymentType}
//                     onClick={handleCreate}
//                 >
//                     Create
//                 </button>
//             </div>

//             <Modal
//                 isOpen={modalIsOpen}
//                 onRequestClose={closeModal}
//                 contentLabel="Customer Form"
//             >
//                 <Form
//                     closeModal={closeModal}
//                     onSave={() => {
//                         closeModal();
//                     }}
//                     cus={selectedCus}
//                     style={{
//                         content: {
//                             width: '30%',
//                             height: '90%',
//                             top: '50%',
//                             left: '50%',
//                             transform: 'translate(-50%, -50%)',
//                         },
//                     }}
//                 />
//             </Modal>


//             <Modal
//             isOpen={guarantorModalIsOpen}
//             onRequestClose={closeGuarantorModal}
//             contentLabel="Guarantor Form"
//         >
//             <GuarantorForm
//                 closeModal={closeGuarantorModal}
//                 onSave={() => {
//                     closeGuarantorModal();
//                 }}
//                 guarantor={selectedGuarantor}
//                 style={{
//                     content: {
//                         width: '30%',
//                         height: '70%',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                     },
//                 }}
//             />
//         </Modal>


//         </div>
//     );
// };

// export default Rent;


import React, { useState, useEffect, useCallback } from "react";
import './Hire.css';
import { User, CarFront } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CusNicSuggest from './CusNicSuggest';
import GNicSuggest from './GNicSuggest';
import config from "../../config";
import Form from "../../Models/Form/Form";
import GuarantorForm from '../../Models/Gurantor/GurantorForm';
import Modal from 'react-modal';

const Rent = ({ onSubmit }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCus, setSelectedCus] = useState(null);
    const [guarantorModalIsOpen, setGuarantorModalIsOpen] = useState(false);
    const [selectedGuarantor, setSelectedGuarantor] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = useState(new Date().toISOString().slice(0, 16));
    const [loading, setLoading] = useState(false);

    const openModal = () => {
        setSelectedCus(null);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);

    };

    const openGuarantorModal = () => {
        setSelectedGuarantor(null);
        setGuarantorModalIsOpen(true);
    };

    const closeGuarantorModal = () => {
        setGuarantorModalIsOpen(false);
    };

    const [customerData, setCustomerData] = useState({
        cusId: '',
        nic: '',
        license: '',
        cusName: '',
        cusAddress: '',
        cusPhone: ''
    });
    const [guarantorData, setGuarantorData] = useState({
        guarantorId: '',
        nic: '',
        guarantorName: '',
        guarantorPhone: '',
        guarantorAddress: ''
    });
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState({
        productId: '',
        productName: '',
        productCode: '',
        productSellingPrice: ''
    });
    const [tableData, setTableData] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [extraCharges, setExtraCharges] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paidAmount, setPaidAmount] = useState(0);
    const [cashierName, setCashierName] = useState('');
    const [refund, setRefund] = useState('');
    const [meeterBefore, setmeeterBefore] = useState('');
    const [note, setNote] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {

        // const fetchHireVehicles = async () => {
        //     try {
        //         const response = await fetch(`${config.BASE_URL}/products`);
        //         if (!response.ok) throw new Error(`Failed to fetch vehicles: ${response.status} ${response.statusText}`);
        //         const data = await response.json();
        //         setVehicles(data.filter(vehicle => vehicle.rentOrHire === 'rent'));
        //     } catch (error) {
        //         console.error('Error fetching hire vehicles:', error);
        //     }
        // };

        const fetchHireVehicles = async () => {
            try {
                const response = await fetch(`${config.BASE_URL}/products/getRentProducts`);
                if (!response.ok) throw new Error(`Failed to fetch vehicles: ${response.status} ${response.statusText}`);
                const data = await response.json();
                setVehicles(data.filter(vehicle => vehicle.rentOrHire === 'rent'));
            } catch (error) {
                console.error('Error fetching hire vehicles:', error);
            }
        };

        const fetchDrivers = async () => {
            try {
                const response = await fetch(`${config.BASE_URL}/getAllDrivers`);
                if (!response.ok) throw new Error(`Failed to fetch drivers: ${response.status} ${response.statusText}`);
                const data = await response.json();
                setDrivers(data);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };

        fetchHireVehicles();
        fetchDrivers();
    }, []);

    const handleSelectCustomer = useCallback((customer) => {
        setCustomerData({
            cusId: customer.cusId,
            nic: customer.nic,
            license: customer.license || '',
            cusName: customer.cusName || '',
            cusAddress: customer.cusAddress || '',
            cusPhone: customer.cusPhone || ''
        });
    }, []);

    const handleSelectGuarantor = useCallback((guarantor) => {
        setGuarantorData({
            guarantorId: guarantor.guarantorId,
            nic: guarantor.nic,
            guarantorName: guarantor.guarantorName || '',
            guarantorPhone: guarantor.guarantorPhone || '',
            guarantorAddress: guarantor.guarantorAddress || ''
        });
    }, []);

    const handleVehicleSelect = useCallback((e) => {
        const selectedId = e.target.value;
        const selected = vehicles.find(vehicle => vehicle.productId === parseInt(selectedId));
        if (selected) {
            setSelectedVehicle({
                productId: selected.productId,
                productName: selected.productName,
                productCode: selected.productCode,
                productSellingPrice: selected.productSellingPrice
            });
        }
    }, [vehicles]);

    const handleDriverSelect = useCallback((e) => {
        setSelectedDriver(e.target.value);
    }, []);

    const handleAdd = useCallback(() => {
        const newRow = {
            customerName: customerData.cusName,
            customerNIC: customerData.nic,
            guarantorName: guarantorData.guarantorName,
            guarantorNIC: guarantorData.nic,
            vehicleName: selectedVehicle.productName,
            numberPlate: selectedVehicle.productCode,
            hirePrice: selectedVehicle.productSellingPrice
        };
        setTableData([...tableData, newRow]);
    }, [customerData, guarantorData, selectedVehicle, tableData]);

    const handleRemoveRow = useCallback((index) => {
        setTableData(tableData.filter((_, i) => i !== index));
    }, [tableData]);


    const compressImage = (file, maxWidth = 1024, maxQuality = 0.7) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            
            img.onload = () => {
              // Create canvas
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              
              // Calculate new dimensions maintaining aspect ratio
              if (width > maxWidth) {
                height = Math.round(height * maxWidth / width);
                width = maxWidth;
              }
              
              // Set canvas dimensions
              canvas.width = width;
              canvas.height = height;
              
              // Draw image on canvas
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              
              // Convert canvas to Blob
              canvas.toBlob((blob) => {
                if (!blob) {
                  console.error("Canvas to Blob conversion failed");
                  resolve(file); // Return original file if compression fails
                  return;
                }
                
                // Create File object from Blob
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                
                console.log(`Compressed image size: ${compressedFile.size} bytes (${Math.round(compressedFile.size / 1024)} KB)`);
                console.log(`Original image size: ${file.size} bytes (${Math.round(file.size / 1024)} KB)`);
                console.log(`Compression ratio: ${Math.round((file.size - compressedFile.size) / file.size * 100)}%`);
                
                resolve(compressedFile);
              }, 'image/jpeg', maxQuality);
            };
          };
          reader.onerror = () => {
            console.error('Error reading file');
            resolve(file); // Return original file if reading fails
          };
        });
      };
      
      // Replace your existing handleFileChange function with this updated version
      const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        
        try {
          setLoading(true); // Show loading state while compressing
          
          // Compress each file
          const compressedFiles = await Promise.all(
            files.map(file => compressImage(file))
          );
          
          // Update selected files with compressed versions
          setSelectedFiles(compressedFiles);
      
          // Create object URLs for previews
          const previews = compressedFiles.map(file => URL.createObjectURL(file));
          setImagePreviews(previews);
        } catch (err) {
          console.error("Image compression failed:", err);
          // Fall back to original files
          setSelectedFiles(files);
          const previews = files.map(file => URL.createObjectURL(file));
          setImagePreviews(previews);
        } finally {
          setLoading(false); // Hide loading state
        }
      };

    const navigate = useNavigate();

    const handleCreate = async () => {
        try {
            setLoading(true);

            if (!customerData.cusId) {
                alert('Please select a customer');
                setLoading(false);
                return;
            }
            if (!selectedVehicle.productId) {
                alert('Please select a vehicle');
                setLoading(false);
                return;
            }

            const totalAmount = Number(selectedVehicle.productSellingPrice) + Number(extraCharges);
            const formData = new FormData();

            // Append all form fields
            formData.append('customerId', customerData.cusId);
            formData.append('guarantorId', guarantorData.guarantorId || '');
            formData.append('productId', selectedVehicle.productId);
            // formData.append('saleDate', new Date().toISOString());
            formData.append('saleDate', selectedDateTime);
            formData.append('cashierName', cashierName);
            formData.append('driverId', selectedDriver || '');
            formData.append('refund', refund);
            formData.append('meeterBefore', meeterBefore);
            formData.append('note', note);
            formData.append('price', selectedVehicle.productSellingPrice);
            formData.append('extraCharges', extraCharges);
            formData.append('totalAmount', totalAmount);
            formData.append('paymentType', paymentType);
            formData.append('paidAmount', paidAmount);
            formData.append('due', Math.max(0, totalAmount - Number(paidAmount)));

            // Append files if they exist
            if (selectedFiles.length > 0) {
                selectedFiles.forEach((file, index) => {
                    formData.append('images', file);
                });
            }

            const response = await fetch(`${config.BASE_URL}/createSale`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create Rent');
            }

            const result = await response.json();

            if (result.success) {
                alert('Rent is Done!');
                // Reset form
                setCustomerData({ cusId: '', nic: '', license: '', cusName: '', cusAddress: '', cusPhone: '' });
                setGuarantorData({ guarantorId: '', nic: '', guarantorName: '', guarantorPhone: '', guarantorAddress: '' });
                setSelectedVehicle({ productId: '', productName: '', productCode: '', productSellingPrice: '' });
                setSelectedDriver('');
                setCashierName('');
                setNote('');
                setRefund('');
                setmeeterBefore('');
                setPaymentType('');
                setPaidAmount(0);
                setExtraCharges(0);
                setTableData([]);
                setSelectedFiles([]);
                setImagePreviews([]);

                navigate('/sales/rentHistory');
            } else {
                throw new Error(result.error || 'Failed to create Rent');
            }

        } catch (error) {
            console.error('Error creating Rent:', error);
            alert(`Failed to create Rent: ${error.message}`);
        } finally {
            // Reset loading state after submission (success or failure)
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid p-5">
            <div className="row">
                <div className="col-md-4 col-sm-12 border-end">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="d-flex align-items-center">
                            <User className="me-2" /> Customer Details
                        </h5>
                        {/* <Link to="/customer/customer-list">
                            <button className="btn btn-primary btn-sm">+ New Customer</button>
                        </Link> */}
                        <button className="btn btn-primary btn-sm" onClick={openModal}>+ New Customer</button>
                    </div>

                    <CusNicSuggest onSelectCustomer={handleSelectCustomer} />

                    <input
                        type="text"
                        className="form-control mb-2  bg-light"
                        placeholder="Customer Licence"
                        value={customerData.license}
                        readOnly
                    />
                    <input
                        type="text"
                        className="form-control mb-2  bg-light"
                        placeholder="Customer Name"
                        value={customerData.cusName}
                        readOnly
                    />
                    <input
                        type="text"
                        className="form-control mb-2  bg-light bg-light"
                        placeholder="Customer Address"
                        value={customerData.cusAddress}
                        readOnly
                    />
                    <input
                        type="text"
                        className="form-control mb-2  bg-light"
                        placeholder="Customer Phone"
                        value={customerData.cusPhone}
                        readOnly
                    />
                </div>

                <div className="col-md-4 col-sm-12  border-end">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="d-flex align-items-center">
                            <i className="bi bi-person-raised-hand me-2" style={{ fontSize: '20px' }}></i>  Guarantor Details
                        </h5>
                        {/* <Link to="/gurantor">
                            <button className="btn btn-primary btn-sm">+ New Guarantor</button>
                        </Link> */}
                        <button className="btn btn-primary btn-sm" onClick={openGuarantorModal}>+ New Guarantor</button>
                    </div>

                    <GNicSuggest onSelectGuarantor={handleSelectGuarantor} />

                    <input
                        type="text"
                        className="form-control mb-2 bg-light"
                        placeholder="Guarantor Name"
                        value={guarantorData.guarantorName}
                        readOnly
                    />
                    <input
                        type="text"
                        className="form-control mb-2 bg-light"
                        placeholder="Guarantor Phone"
                        value={guarantorData.guarantorPhone}
                        readOnly
                    />
                    <input
                        type="text"
                        className="form-control mb-2 bg-light"
                        placeholder="Guarantor Address"
                        value={guarantorData.guarantorAddress}
                        readOnly
                    />
                </div>

                <div className="col-md-4  col-sm-12 ">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="d-flex align-items-center">
                            <CarFront className="me-2" />Rent Vehicle Details
                        </h5>
                        <Link to="/product/product-list">
                            <button className="btn btn-primary btn-sm">+ New Rent Vechicle</button>
                        </Link>
                    </div>
                    <select
                        className="form-control mb-2"
                        onChange={handleVehicleSelect}
                        value={selectedVehicle.productId}
                    >
                        <option value="">Select Vehicle</option>
                        {vehicles.map(vehicle => (
                            <option key={vehicle.productId} value={vehicle.productId}>
                                {/* {vehicle.productName} */}
                                <div className="fw-bold"> {vehicle.productName}</div> |
                                <div className="small text-muted"> {vehicle.productCode}</div>
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        className="form-control mb-2 d-none"
                        placeholder="Vehicle Name"
                        value={selectedVehicle.productName}
                        readOnly
                    />

                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Number Plate"
                        value={selectedVehicle.productCode}
                        readOnly
                    />
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Rent Price"
                        value={selectedVehicle.productSellingPrice}
                        onChange={(e) =>
                            setSelectedVehicle({ ...selectedVehicle, productSellingPrice: e.target.value })
                        }
                    />

                </div>
            </div>

            <div className="d-flex justify-content-end">
                <button className="btn btn-primary mt-3" onClick={handleAdd}>Add</button>
            </div>

            <div className="table-responsive mt-3">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Customer NIC</th>
                            <th>Guarantor Name</th>
                            <th>Guarantor NIC</th>
                            <th>Vehicle Name</th>
                            <th>Number Plate</th>
                            <th>Rent Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.customerName}</td>
                                <td>{row.customerNIC}</td>
                                <td>{row.guarantorName}</td>
                                <td>{row.guarantorNIC}</td>
                                <td>{row.vehicleName}</td>
                                <td>{row.numberPlate}</td>
                                <td>{row.hirePrice}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm p-2"
                                        onClick={() => handleRemoveRow(index)}
                                    >
                                        -
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            <div className="row mt-3">
                {/* Left Section */}
                <div className="col-md-6">
                    {/* <label>Today's Date</label>
                    <input type="text" className="form-control mb-2" value={new Date().toLocaleString()} /> */}

                    <label>Select Date and Time (Starting Date)</label>
                    <input
                        type="datetime-local"
                        className="form-control mb-2"
                        value={selectedDateTime}
                        onChange={(e) => setSelectedDateTime(e.target.value)}
                    />


                    <label>Cashier</label>
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Cashier Name"
                        value={cashierName}
                        onChange={(e) => setCashierName(e.target.value)}
                    />

                    {/* <label>Driver Select</label>
                    <select className="form-control mb-2" onChange={handleDriverSelect} value={selectedDriver}>
                        <option value="">Select Driver</option>
                        {drivers.map(driver => (
                            <option key={driver.id} value={driver.id}>
                                {driver.driverName} - {driver.driverNic}
                            </option>
                        ))}
                    </select> */}


                    <label>Upload Images</label>
                    <input
                        type="file"
                        className="form-control mb-2"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    {/* Display Selected Files */}
                    {imagePreviews.length > 0 && (
                        <div className="mt-2">
                            <strong>Selected Files:</strong>
                            <ul className="list-unstyled">
                                {imagePreviews.map((preview, index) => (
                                    <li key={index}>
                                        <img src={preview} alt={`Preview ${index}`} style={{ width: '100px', height: 'auto' }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Display Selected Files */}
                    {/* {selectedFiles.length > 0 && (
                                <div className="mt-2">
                                    <strong>Selected Files:</strong>
                                    <ul className="list-unstyled">
                                        {selectedFiles.map((file, index) => (
                                            <li key={index}>{file.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )} */}
                </div>

                {/* Right Section */}
                <div className="col-md-6">
                    <label>Rent Price</label>
                    <input
                        type="number"
                        className="form-control mb-2"
                        value={selectedVehicle.productSellingPrice}
                        onChange={(e) => setSelectedVehicle({ ...selectedVehicle, productSellingPrice: e.target.value })}
                    />

                    <label>Extra Charges</label>
                    <input
                        type="number"
                        className="form-control mb-2"
                        value={extraCharges}
                        onChange={(e) => setExtraCharges(e.target.value)}
                    />

                    <label>Total Amount</label>
                    <input
                        type="number"
                        className="form-control mb-2"
                        value={Number(selectedVehicle.productSellingPrice) + Number(extraCharges)}
                        readOnly
                    />



                    <div className="d-flex gap-2 mt-2">
                        <button
                            className={`btn ${paymentType === 'cash' ? 'btn-dark' : 'btn-secondary'}`}
                            onClick={() => setPaymentType('cash')}
                        >
                            Cash
                        </button>
                        <button
                            className={`btn ${paymentType === 'pay_later' ? 'btn-dark' : 'btn-secondary'}`}
                            onClick={() => setPaymentType('pay_later')}
                        >
                            Pay Later
                        </button>
                        <button
                            className={`btn ${paymentType === 'online' ? 'btn-dark' : 'btn-secondary'}`}
                            onClick={() => setPaymentType('online')}
                        >
                            Online Payment
                        </button>
                    </div>

                    {paymentType && (
                        <>
                            <label className="mt-2">Paid Amount</label>
                            <input
                                type="number"
                                className="form-control mb-2"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                            />

                            {/* <label>Extra Charges</label>
                <input
                    type="number"
                    className="form-control mb-2"
                    value={extraCharges}
                    onChange={(e) => setExtraCharges(e.target.value)}
                /> */}

                            <label>Due</label>
                            <input
                                type="number"
                                className="form-control mb-2"
                                value={Math.max(0, (Number(selectedVehicle.productSellingPrice) + Number(extraCharges)) - Number(paidAmount))}
                                readOnly
                            />
                        </>
                    )}

                    <label>Refundable Deposit</label>
                    <input
                        className="form-control mb-2"
                        placeholder="Refundable Deposit"
                        value={refund}
                        onChange={(e) => setRefund(e.target.value)}
                    />

                    <label>Meeter Read (Before Rent)</label>
                    <input
                        className="form-control mb-2"
                        placeholder="Meeter Read"
                        value={meeterBefore}
                        onChange={(e) => setmeeterBefore(e.target.value)}
                    />


                    <label>Note</label>
                    <textarea
                        className="form-control mb-2"
                        placeholder="Note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>

                </div>
            </div>


            <div className="mt-3 justify-content-end d-flex">
                <button className="btn btn-danger me-2">Cancel</button>
                {/* <button className="btn btn-primary" onClick={handleCreate} >Create</button> */}

                <button
                    className="btn btn-primary me-2"
                    disabled={!paymentType || loading} // Disable button while loading
                    onClick={handleCreate}
                >
                    {loading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Customer Form"
            >
                <Form
                    closeModal={closeModal}
                    onSave={() => {
                        closeModal();
                    }}
                    cus={selectedCus}
                    style={{
                        content: {
                            width: '30%',
                            height: '90%',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        },
                    }}
                />
            </Modal>


            <Modal
                isOpen={guarantorModalIsOpen}
                onRequestClose={closeGuarantorModal}
                contentLabel="Guarantor Form"
            >
                <GuarantorForm
                    closeModal={closeGuarantorModal}
                    onSave={() => {
                        closeGuarantorModal();
                    }}
                    guarantor={selectedGuarantor}
                    style={{
                        content: {
                            width: '30%',
                            height: '70%',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        },
                    }}
                />
            </Modal>


        </div>
    );
};

export default Rent;
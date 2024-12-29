import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Send, Camera, ArrowLeft, Check } from 'lucide-react';
document.getElementById('searchButton').addEventListener('click', handleSearch);

function handleSearch() {
    const uniqueId = document.getElementById('uniqueId').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    if (uniqueId === '84859-012395') {
        // Hide error message and display order information
        errorMessage.style.display = 'none';
        document.getElementById('orderInfoSection').classList.remove('hidden');
        document.getElementById('materialsTableSection').classList.remove('hidden');
        document.getElementById('photoCaptureSection').classList.remove('hidden');
        document.getElementById('actionButtons').classList.remove('hidden');
    } else {
        // Show error message and hide order information
        errorMessage.style.display = 'block';
        document.getElementById('orderInfoSection').classList.add('hidden');
        document.getElementById('materialsTableSection').classList.add('hidden');
        document.getElementById('photoCaptureSection').classList.add('hidden');
        document.getElementById('actionButtons').classList.add('hidden');
    }
}


const QuickReceiveApp = () => {
  const [currentPage, setCurrentPage] = useState('search');
  const [uniqueId, setUniqueId] = useState('');
  const [orderInfo, setOrderInfo] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [packingSlipPhoto, setPackingSlipPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const sampleOrder = {
    customerNumber: '84859',
    orderDate: '5-Mar-24',
    poNumber: '012395',
    supplier: 'XD Distributors',
    materials: [
      { id: 1, qty: 30, uom: 'M', description: '600mm cable tray', catalog: 'XX-600', received: 0, hasDeficiency: false, comments: '' },
      { id: 2, qty: 42, uom: 'M', description: '300mm cable tray', catalog: 'XX-300', received: 0, hasDeficiency: false, comments: '' },
      { id: 3, qty: 12, uom: 'M', description: '150mm cable tray', catalog: 'XX-150', received: 0, hasDeficiency: false, comments: '' },
      { id: 4, qty: 42, uom: 'M', description: '300mm cable tray cover', catalog: 'XX-300C', received: 0, hasDeficiency: false, comments: '' },
      { id: 5, qty: 300, uom: 'Ea', description: '3/8" tray hardware', catalog: 'XX-HDW', received: 0, hasDeficiency: false, comments: '' },
    ]
  };

  const handleSearch = () => {
    if (uniqueId === '84859-012395') {
      setOrderInfo(sampleOrder);
      setMaterials(sampleOrder.materials);
    }
  };

  const handleReceiveAll = () => {
    setMaterials(materials.map(item => ({
      ...item,
      received: item.qty,
      hasDeficiency: false
    })));
  };

  const handleQuantityChange = (id, value) => {
    setMaterials(materials.map(item => {
      if (item.id === id) {
        const received = Math.min(parseInt(value) || 0, item.qty);
        return {
          ...item,
          received,
          hasDeficiency: received < item.qty
        };
      }
      return item;
    }));
  };

  const handleCommentChange = (id, comment) => {
    setMaterials(materials.map(item => 
      item.id === id ? { ...item, comments: comment } : item
    ));
  };

  const handlePhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPackingSlipPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = () => {
    if (!packingSlipPhoto) {
      alert('Please capture the packing slip photo before submitting.');
      return;
    }

    setCurrentPage('confirmation');
  };

  const handleReset = () => {
    setUniqueId('');
    setOrderInfo(null);
    setMaterials([]);
    setPackingSlipPhoto(null);
    setCurrentPage('search');
  };

  const renderSearchPage = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Quick Receive</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Hidden file input for photo capture */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            className="hidden"
          />

          <div className="flex gap-4">
            <Input
              placeholder="Enter Unique ID# (try: 84859-012395)"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {orderInfo && (
            <>
              {/* Order Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Customer Number</div>
                  <div className="font-medium">{orderInfo.customerNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Order Date</div>
                  <div className="font-medium">{orderInfo.orderDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">PO #</div>
                  <div className="font-medium">{orderInfo.poNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Supplier</div>
                  <div className="font-medium">{orderInfo.supplier}</div>
                </div>
              </div>

              {/* Materials Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Line</th>
                      <th className="text-left p-2">Qty Ordered</th>
                      <th className="text-left p-2">UOM</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-left p-2">Catalog #</th>
                      <th className="text-center p-2">Status</th>
                      <th className="text-left p-2">Qty Received</th>
                      <th className="text-left p-2">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">{item.id}</td>
                        <td className="p-2">{item.qty}</td>
                        <td className="p-2">{item.uom}</td>
                        <td className="p-2">{item.description}</td>
                        <td className="p-2">{item.catalog}</td>
                        <td className="p-2 text-center">
                          {item.received === item.qty ? (
                            <CheckCircle2 className="inline text-green-500" />
                          ) : item.hasDeficiency ? (
                            <XCircle className="inline text-red-500" />
                          ) : null}
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={item.received}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="w-24"
                            min="0"
                            max={item.qty}
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            value={item.comments}
                            onChange={(e) => handleCommentChange(item.id, e.target.value)}
                            placeholder="Add comment..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              

              {/* Packing Slip Photo Capture */}
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Packing Slip Photo</div>
                <Button onClick={triggerFileInput} variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Packing Slip
                </Button>
                
                {packingSlipPhoto && (
                  <div className="mt-2">
                    <img 
                      src={packingSlipPhoto} 
                      alt="Packing Slip" 
                      className="max-w-full h-48 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleReceiveAll}>
                  Receive All
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!packingSlipPhoto}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send to Purchaser
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
document.getElementById('searchButton').addEventListener('click', handleSearch);

function handleSearch() {
    const uniqueId = document.getElementById('uniqueId').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    if (uniqueId === '84859-012395') {
        // Hide error message and display order information
        errorMessage.style.display = 'none';
        document.getElementById('orderInfoSection').classList.remove('hidden');
        document.getElementById('materialsTableSection').classList.remove('hidden');
        document.getElementById('photoCaptureSection').classList.remove('hidden');
        document.getElementById('actionButtons').classList.remove('hidden');
    } else {
        // Show error message and hide order information
        errorMessage.style.display = 'block';
        document.getElementById('orderInfoSection').classList.add('hidden');
        document.getElementById('materialsTableSection').classList.add('hidden');
        document.getElementById('photoCaptureSection').classList.add('hidden');
        document.getElementById('actionButtons').classList.add('hidden');
    }
}

  const renderConfirmationPage = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Submission Confirmation</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <Check className="w-24 h-24 text-green-500" />
          <h2 className="text-2xl font-bold">Submission Successful</h2>
          <p className="text-gray-600">
            Packing slip for PO #{orderInfo.poNumber} has been sent to the purchaser.
          </p>
          <div className="mt-4">
            <img 
              src={packingSlipPhoto} 
              alt="Submitted Packing Slip" 
              className="max-w-full h-64 object-cover rounded"
            />
          </div>
          <Button onClick={handleReset}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {currentPage === 'search' && renderSearchPage()}
      {currentPage === 'confirmation' && renderConfirmationPage()}
    </>
  );
};

export default QuickReceiveApp;

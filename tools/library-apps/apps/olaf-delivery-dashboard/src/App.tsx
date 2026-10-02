import React, { useState } from 'react';
import './App.css';
import { CheckCircle, Truck, Package, XCircle, User, Info, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';

const DeliveryDashboard = () => {
  const [counts, setCounts] = useState({
    vans: 0,
    lorries: 0,
    skipLorries: 0,
    courierDropOffs: 0
  });
  const [showPrompt, setShowPrompt] = useState(false);
  const [showProblem, setShowProblem] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [staff, setStaff] = useState({
    Sam: false,
    Effie: false,
    Helen: false
  });

  const incrementCount = (type) => {
    setCounts(prev => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const decrementCount = (type) => {
    setCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
  };

  const toggleStaff = (name) => {
    setStaff(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const isComplete = () => {
    return counts.vans >= 3 &&
           counts.lorries >= 2 &&
           counts.skipLorries >= 1 &&
           counts.courierDropOffs >= 5 &&
           Object.values(staff).every(Boolean);
  };

  return (
    <div className="delivery-app p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center">Olaf's Delivery Dashboard</h1>
      <p>A fictional checklist exercise: count deliveries and check each person out. Counts stay in this page until you reset or reload; they are not a site safety record.</p>
      
      <div className="flex space-x-2 mb-4">
        <button
          aria-expanded={showPrompt}
          onClick={() => setShowPrompt(!showPrompt)}
          className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
        >
          <Info className="w-4 h-4 mr-1" />
          Show Instructions
        </button>
        <button
          aria-expanded={showProblem}
          onClick={() => setShowProblem(!showProblem)}
          className="flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-sm"
        >
          <AlertTriangle className="w-4 h-4 mr-1" />
          Why This Helps
        </button>
        <button
          aria-expanded={showOriginal}
          onClick={() => setShowOriginal(!showOriginal)}
          className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm"
        >
          <Info className="w-4 h-4 mr-1" />
          Original Prompt
        </button>
      </div>

      {showPrompt && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Your Instructions</AlertTitle>
          <AlertDescription>
            Hi Olaf! We need you to count deliveries this afternoon due to staff absence. Please receive: 3 vans, 2 lorries, 1 skip lorry, and 5 courier drop-offs. Also check that Sam, Effie, and Helen have all left for the day. Once everything is complete, you can close the site gates and head home!
          </AlertDescription>
        </Alert>
      )}

      {showProblem && (
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Problem This Solves</AlertTitle>
          <AlertDescription>
            With staff absent today, we needed a simple way to track multiple delivery types and ensure proper site closure procedures. The checklist makes the requested counts and confirmations visible. It cannot verify a delivery, a person’s location, or the other conditions needed to close a real site.
          </AlertDescription>
        </Alert>
      )}
      
      {showOriginal && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Original Prompt</AlertTitle>
          <AlertDescription>
            "I'm hoping to our ask our new intern Olaf to count deliveries in for us this afternoon, owing to absence. He can close the site gates after he has received 3 vans, 2 lorries, one skip lorry , 5 courier drop offs and has checked that Sam , Effie, and Helen have left for the day. Could you make this fun and easy for him by giving him a personalised count down dashboard where he can keep a tally of each type. In particular , make sure he checks off the names individually of the three people. When complete , the dashboard can show he can go home"
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <CounterButton icon={Truck} label="Vans" count={counts.vans} target={3} onClick={() => incrementCount('vans')} onUndo={() => decrementCount('vans')} />
        <CounterButton icon={Truck} label="Lorries" count={counts.lorries} target={2} onClick={() => incrementCount('lorries')} onUndo={() => decrementCount('lorries')} />
        <CounterButton icon={Truck} label="Skip Lorries" count={counts.skipLorries} target={1} onClick={() => incrementCount('skipLorries')} onUndo={() => decrementCount('skipLorries')} />
        <CounterButton icon={Package} label="Courier Drop-offs" count={counts.courierDropOffs} target={5} onClick={() => incrementCount('courierDropOffs')} onUndo={() => decrementCount('courierDropOffs')} />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Staff Check-out</h2>
        {Object.entries(staff).map(([name, checked]) => (
          <StaffCheckButton key={name} name={name} checked={checked} onClick={() => toggleStaff(name)} />
        ))}
      </div>

      <button onClick={() => { setCounts({ vans: 0, lorries: 0, skipLorries: 0, courierDropOffs: 0 }); setStaff({ Sam: false, Effie: false, Helen: false }); }}>Reset exercise</button>
      <div role="status" aria-live="polite">
      {isComplete() && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>All tasks completed!</AlertTitle>
          <AlertDescription>
            All targets and individual check-outs are recorded in this exercise. In a real site, follow the responsible person’s closure procedure before closing the gates or leaving.
          </AlertDescription>
        </Alert>
      )}
      </div>
    </div>
  );
};

const CounterButton = ({ icon: Icon, label, count, target, onClick, onUndo }) => (
  <div className="counter-row"><button
    aria-label={`Add ${label}: ${count} of ${target}`}
    onClick={onClick}
    className={`flex items-center justify-between w-full p-2 rounded ${count >= target ? 'bg-green-100' : 'bg-gray-100'}`}
  >
    <div className="flex items-center">
      <Icon className="mr-2" />
      <span>{label}</span>
    </div>
    <span className="font-bold">{count} / {target}</span>
  </button><button aria-label={`Undo ${label}`} onClick={onUndo} disabled={count === 0}>−1</button></div>
);

const StaffCheckButton = ({ name, checked, onClick }) => (
  <button
    aria-pressed={checked}
    aria-label={`${name}: ${checked ? 'checked out' : 'not yet checked out'}`}
    onClick={onClick}
    className={`flex items-center justify-between w-full p-2 rounded ${checked ? 'bg-green-100' : 'bg-gray-100'}`}
  >
    <div className="flex items-center">
      <User className="mr-2" />
      <span>{name}</span>
    </div>
    {checked ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
  </button>
);

export default DeliveryDashboard;


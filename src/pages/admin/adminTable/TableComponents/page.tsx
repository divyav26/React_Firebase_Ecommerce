

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"






// Simulate a database read for tasks.


export default function TaskPage() {
  const tasks = [
  
    {
      "id": "TASK-8053",
      "title": "If we connect the program, we can get to the UTF8 matrix through the digital UDP protocol!",
      "status": "todo",
      "label": "feature",
      "priority": "medium"
    },
    {
      "id": "TASK-4336",
      "title": "If we synthesize the microchip, we can get to the SAS sensor through the optical UDP program!",
      "status": "todo",
      "label": "documentation",
      "priority": "low"
    },
    {
      "id": "TASK-8790",
      "title": "I'll back up the optical COM alarm, that should alarm the RSS capacitor!",
      "status": "done",
      "label": "bug",
      "priority": "medium"
    },
    {
      "id": "TASK-8980",
      "title": "Try to navigate the SQL transmitter, maybe it will back up the virtual firewall!",
      "status": "canceled",
      "label": "bug",
      "priority": "low"
    },
    {
      "id": "TASK-7342",
      "title": "Use the neural CLI card, then you can parse the online port!",
      "status": "backlog",
      "label": "documentation",
      "priority": "low"
    },
    {
      "id": "TASK-5608",
      "title": "I'll hack the haptic SSL program, that should bus the UDP transmitter!",
      "status": "canceled",
      "label": "documentation",
      "priority": "low"
    },
    {
      "id": "TASK-1606",
      "title": "I'll generate the bluetooth PNG firewall, that should pixel the SSL driver!",
      "status": "done",
      "label": "feature",
      "priority": "medium"
    },
    {
      "id": "TASK-7872",
      "title": "Transmitting the circuit won't do anything, we need to reboot the 1080p RSS monitor!",
      "status": "canceled",
      "label": "feature",
      "priority": "medium"
    },
    {
      "id": "TASK-4167",
      "title": "Use the cross-platform SMS circuit, then you can synthesize the optical feed!",
      "status": "canceled",
      "label": "bug",
      "priority": "medium"
    },
    {
      "id": "TASK-9581",
      "title": "You can't index the port without hacking the cross-platform XSS monitor!",
      "status": "backlog",
      "label": "documentation",
      "priority": "low"
    },
    {
      "id": "TASK-8806",
      "title": "We need to bypass the back-end SSL panel!",
      "status": "done",
      "label": "bug",
      "priority": "medium"
    },
    {
      "id": "TASK-6542",
      "title": "Try to quantify the RSS firewall, maybe it will quantify the open-source system!",
      "status": "done",
      "label": "feature",
      "priority": "low"
    },
  
  ]

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-4 p-4 md:flex">
       
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  )
}

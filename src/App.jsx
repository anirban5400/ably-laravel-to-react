import './App.css'
import { useEffect, useRef, useState } from 'react'

function Card({ title, children }) {
  return (
    <div className="card-box">
      <h3 className="card-title">{title}</h3>
      {children}
    </div>
  )
}

function App() {
  const [name, setName] = useState('anirban')
  const [status, setStatus] = useState('online')
  const [statusUpdates, setStatusUpdates] = useState([])

  const [noteTitle, setNoteTitle] = useState('Demo Notification')
  const [noteMsg, setNoteMsg] = useState('Hello from notify-demo')
  const [noteType, setNoteType] = useState('info')
  const [notifications, setNotifications] = useState([])

  const [simpleMsg, setSimpleMsg] = useState('')
  const [simpleLogs, setSimpleLogs] = useState([])

  const [ownUserId, setOwnUserId] = useState('1001')
  const [peerUserId, setPeerUserId] = useState('1002')
  const [dmText, setDmText] = useState('')
  const [dmLogs, setDmLogs] = useState([])
  const dmChannelRef = useRef(null)
  const dmChannelNameRef = useRef(null)

  const parsePayload = (incoming) => {
    let payload = incoming
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload) } catch (e) { void e }
    }
    if (payload && typeof payload === 'object' && typeof payload.data === 'string') {
      try { payload = JSON.parse(payload.data) } catch (e) { void e }
    }
    return payload
  }

  useEffect(() => {
    if (!window.Echo) return
    // Public demo (both dotted and class-style names)
    const publicChan = window.Echo.channel('public-demo')
    const publicHandler = (evt) => {
      const e = parsePayload(evt)
      const text = e?.message ?? e?.data?.message ?? JSON.stringify(e)
      setSimpleLogs((prev) => [...prev, text])
    }
    publicChan.listen('.MessageSent', publicHandler)

    // Notifications
    const notifyChan = window.Echo.channel('notify-demo')
    const notifyHandler = (evt) => {
      const e = parsePayload(evt)
      setNotifications((prev) => [
        ...prev,
        { type: e?.type || 'info', title: e?.title || 'Demo Notification', message: e?.message || '', received_at: new Date().toLocaleTimeString() },
      ])
    }
    notifyChan.listen('.DemoNotificationSent', notifyHandler)

    // Status
    const statusChan = window.Echo.channel('status-demo')
    const statusHandler = (evt) => {
      const e = parsePayload(evt)
      setStatusUpdates((prev) => [
        ...prev,
        { name: e?.user || 'Guest', status: e?.status || 'online', received_at: new Date().toLocaleTimeString() },
      ])
    }
    // Only listen to one event name to avoid duplicates
    statusChan.listen('.DemoStatusChanged', statusHandler)
    
    // Cleanup prevents duplicate listeners under React Strict Mode
    return () => {
      try {
        publicChan.stopListening('.MessageSent')
        notifyChan.stopListening('.DemoNotificationSent')
        statusChan.stopListening('.DemoStatusChanged')
        window.Echo.leave('public-demo')
        window.Echo.leave('notify-demo')
        window.Echo.leave('status-demo')
      } catch (e) { void e }
    }
  }, [])

  const connectDm = () => {
    if (!window.Echo) return
    if (dmChannelRef.current) {
      dmChannelRef.current.stopListening('.DirectMessageSent')
      dmChannelRef.current.stopListening('App\\\\Events\\\\DirectMessageSent')
    }
    if (dmChannelNameRef.current) {
      try { window.Echo.leave(dmChannelNameRef.current) } catch (e) { void e }
    }
    dmChannelNameRef.current = `chat.user.${ownUserId}`
    dmChannelRef.current = window.Echo.channel(dmChannelNameRef.current)
    const handler = (evt) => {
      const e = parsePayload(evt)
      if (e && e.message && e.fromUserId && e.toUserId) {
        setDmLogs((prev) => [...prev, `From ${e.fromUserId} → ${e.toUserId}: ${e.message}`])
      }
    }
    dmChannelRef.current.listen('.DirectMessageSent', handler)
    dmChannelRef.current.listen('App\\\\Events\\\\DirectMessageSent', handler)
  }

  // These demo endpoints don't require cookies; avoid credentials to reduce CORS preflights
  const post = (url, data) => window.axios.post(url, data, { withCredentials: false, headers: { 'Accept': 'application/json' } }).then(r => r.data)

  const sendSimple = () => post('/api/broadcast-demo', { message: simpleMsg }).then(() => setSimpleMsg(''))
  const sendNote = () => post('/api/notify-demo', { title: noteTitle, message: noteMsg, type: noteType })
  const announce = () => {
    // Only send to API, don't add to local state
    // The update will appear when received from the channel
    post('/api/status-demo', { user: name, status })
  }
  const sendDm = () => post('/api/dm-send', { fromUserId: ownUserId, toUserId: peerUserId, message: dmText }).then(() => {
    if (dmText) setDmLogs((prev) => [...prev, `From ${ownUserId} → ${peerUserId}: ${dmText}`])
    setDmText('')
  })
  return (
    <div className="page">
      <h2 className="heading">Realtime Feature Playground</h2>
      {/* Status + Notifications + Simple demo cards */}
      <div className="grid">
        <Card title="Live status testing">
          <p className="muted">Announce your status and watch it update across browsers.</p>
          <input className="input" placeholder="Your Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <select className="input" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
          <button className="btn primary" onClick={announce}>Announce Status</button>

          <div className="status-box">
            <div className="status-title">Status Updates:</div>
            {statusUpdates.length === 0 ? (
              <div className="muted small">No status updates yet.</div>
            ) : (
              statusUpdates.map((u, idx) => (
                <div key={idx} className={`status-item ${u.status === 'online' ? 'ok' : ''}`}>
                  <span className="bold">{u.name} is {u.status}.</span> <span className="muted small">({u.received_at})</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="Notification test">
          <p className="muted">Send a notification and see it arrive instantly.</p>
          <input className="input" placeholder="Title" value={noteTitle} onChange={(e)=>setNoteTitle(e.target.value)} />
          <input className="input" placeholder="Message" value={noteMsg} onChange={(e)=>setNoteMsg(e.target.value)} />
          <select className="input" value={noteType} onChange={(e)=>setNoteType(e.target.value)}>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <button className="btn primary" onClick={sendNote}>Send notification</button>
          <div className="notifications">
            {notifications.length === 0 ? (
              <div className="muted small">No notifications yet.</div>
            ) : (
              notifications.map((n, idx) => (
                <div key={idx} className="note">[{n.type.toUpperCase()}] {n.title}: {n.message} ({n.received_at})</div>
              ))
            )}
          </div>
        </Card>

        <Card title="Simple Livewire + Ably Demo">
          <div className="panel">
            <div className="panel-inner">
              <div className="muted small">Open two tabs to see messages arrive in real-time.</div>
              <div id="simple-messages" className="messages">
                {simpleLogs.map((m, idx) => (<div key={idx} className="msg">{m}</div>))}
              </div>
              <div className="row">
                <input className="input" placeholder="Type a message" value={simpleMsg} onChange={(e)=>setSimpleMsg(e.target.value)} />
                <button className="btn primary" onClick={sendSimple}>Send</button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Direct chat (user ↔ user) */}
      <div className="direct">
        <h3>Direct chat (user ↔ user)</h3>
        <p className="muted">Enter your own user ID and the peer's user ID to chat one-to-one.</p>
        <div className="row">
          <input className="input" placeholder="Your User ID" value={ownUserId} onChange={(e)=>setOwnUserId(e.target.value)} />
          <input className="input" placeholder="Chat with User ID" value={peerUserId} onChange={(e)=>setPeerUserId(e.target.value)} />
          <button className="btn primary wide" onClick={connectDm}>Connect</button>
        </div>

        <div className="direct-panel">
          <div className="label">Direct messages:</div>
          <div className="direct-messages" id="dm-log">
            {dmLogs.map((m, idx) => (<div key={idx}>{m}</div>))}
          </div>
          <div className="row">
            <input className="input" placeholder="Type a message" value={dmText} onChange={(e)=>setDmText(e.target.value)} />
            <button className="btn primary" onClick={sendDm}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

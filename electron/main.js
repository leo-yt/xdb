const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('node:path')
require('./db');

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1000,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		},
	})
	if (process.env.NODE_ENV === 'dev') {
		win.loadURL('http://localhost:3000');
		win.webContents.openDevTools();
	} else {
		win.loadFile(path.join(__dirname, '../build/index.html'))
	}
}

app.whenReady().then(() => {
	globalShortcut.register('CommandOrControl+R', () => false)
	createWindow()
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})
app.on('will-quit', () => {
	globalShortcut.unregister('CommandOrControl+R')
})

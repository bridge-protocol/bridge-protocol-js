---
id: extension-managing
title: Security and Backup
sidebar_label: Security and Backup
---

All security and backup options can be found in the dropdown menu accessed from the icon in the upper right corner of the Bridge Passport.  Using these options the user can export, lock, and unload their passport.

<p><img class='centered' src='/img/extension/passport-options.jpg'></img></p>

### Backing Up
To backup the Bridge Passport (this is especially important after verified claims have been imported), simply choose the Export Passport menu option and the passport JSON file will be downloaded to the filesystem.  This file should be backed up and the password for the passport should be kept in a safe place.  If either are lost, the passport cannot be recovered.

### Locking
For additional security, users can choose to lock the passport.  When the passport is locked, the unencrypted passport is no longer available in browser memory and will require the password to be provided at next use.  By default, when all browser instances are closed, the passport will be in a locked state.

### Unlocking
If a passport is locked, the next time the user attempts to access their passport, they will simply need to provide the password given when it was created to unlock the passport.

<p><img class='centered' src='/img/extension/passport-unlock.jpg'></img></p>

### Unloading
The user can unload the passport entirely from browser memory using the Unload Passport option.  When the passport is unloaded, they will either need to create a new passport or import an existing passport.

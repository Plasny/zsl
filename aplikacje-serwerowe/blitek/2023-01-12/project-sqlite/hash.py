#!/usr/bin/env python3

import hashlib
import getpass

passwd = getpass.getpass('Enter text for hashing: ').encode()
print(hashlib.sha256(passwd).hexdigest())

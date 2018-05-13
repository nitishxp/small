import serial
def bits_to_hex(user8bit): # convert the 8-bit user input to hex
    numInt = int(user8bit, 2)
    strHex = hex(numInt)
    userHex = strHex[2:].zfill(2)
    # make sure the payload is a two-digit hex
    return userHex


port = "COM3"
ser = serial.Serial(port, 19200, timeout=0.5)
print(ser.name + ' is open.')

while True:
    input = raw_input("Enter HEX cmd or 'exit'>> ")
    if input == 'exit':
        ser.close()
        print(port + ' is closed.')
        exit()

    elif len(input) == 8:
        # user enters new register value, convert it into hex
        newRegisterValue = bits_to_hex(input)
        ser.write(newRegisterValue.decode('hex') + '\r\n')
        print('Saving...' + newRegisterValue)
        print('Receiving...')
        out = ser.read(1)
        for byte in out:
            print(byte)  # present ascii

    else:
        cmd = input
        print('Sending...' + cmd)
        ser.write(cmd.decode('hex') + '\r\n')
        print('Receiving...')
        out = ser.read(1)
        for byte in out:
            print(byte)  # present ascii
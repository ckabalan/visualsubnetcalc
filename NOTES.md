# Notes

## Efficient Saves

Looks like the most efficient way to store an address is to track the base network (say 10.0.0.0/8) and then represent
all other addresses as offsets from that base network. This way, we can store a subnet as a base network and a mask. The
most efficient way to store this is to store two values:

- The base network offset (0 to 4,294,967,296)
  - 0 being the best case, a subnet within the base subnet with the same network address (10.0.0.0/24)
  - 255.255.255.255 being the worst case, the last address in 0.0.0.0/0 (unrealistic)
- The mask (0 to 32)

Combine both of these values into a single binary string that is 32+5 bits. Round the storage up to the nearest byte
(40 bits = 5 bytes), padding the remaining bits with 0s, then encode this 5 byte string into a URL-safe base64 string.

Example for 10.0.0.0/8 and representing the network 10.0.15.0/24:
Find the offset:
    10.0.0.0 (decimal):
        00001010 00000000 00000000 00000000 → 167772160
    10.0.15.0 (decimal):
        00001010 00000000 00001111 00000000 → 167775232
    Offset: 167775232 - 167772160 = 3072

Hmmm, this above works good for close together smaller networks but gets ugly when you're dealing with larger networks
because the offset is huge.

I'm thinking about a coordinate system. Let's say you have a base network of 10.0.0.0/8 and you want to as concisely as
possible represent 10.166.64.0/20. We could represent this as the nth /20 within the /8 and just store N-20, and
probably shorten that even more with the last digit always being base32 for the mask.

If I'm doing my math right you can say a /20 has 4096 addresses.

10.0.0.0 = 167772160
10.166.64.0 = 178667520
178667520 - 167772160 = 10895360
10895360 / 4096 = 2660
Which means 10.166.64.0 is the 2,660th /20 within the /8. You could store this as 2660x20 (inefficient)

You can reverse this 2660x20 from 10.0.0.0/8 by doing the following:
a /21 has 4096 addresses, times the 2660th network is 10895360. Add that to the base network address to get the network

10.0.0.0 = 167772160
167772160 + 10895360 = 178667520
178667520 = 10.166.64.0 then you can tack back on the /20

This has the advantage overall that you're unlikely to store wildly different subnet sizes in the same page. Your "N" in
the "Nth" subnet is likely to be very small. You're more likely to store the Nth /24 in a /20 than you are a /20 in an
/8. So the numbers will mostly be 1-2 digits, rarely 3 digits, and almost never 4 digits as depicted above.

I then for efficienty I could use this format:

`[Nth Network as Integer][Network Size as Base32]`

So lets say you're wanting to represent the 0th /24 in a /20 you would represent it as `00`, always knowing the last
digit is the network size. Or the 0th /32 would be `07` (32 in base32 is 7). or the 5th /28 would be `54`.


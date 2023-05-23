# Visual Subnet Calculator

Use live: [visualsubnetcalc.com](https://visualsubnetcalc.com)

Visual Subnet Calculator is a modernized tool based on the original work by [davidc](https://github.com/davidc/subnets).
It strives to be a tool for quickly designing networks and collaborating on that design with others. It focuses on
expediting the work of network administrators, not academic subnetting math.

## Design Tenants

The following tenants are the most important values that drive the design of the tool. New features, pull requests, etc
should align to these tenants, or propose an adjustment to the tenants.

- **Simplicity is king.** Network admins are busy and Visual Subnet Calculator should always be easy for FIRST TIME USERS to
  quickly and intuitively use.
- **Subnetting is design work.** Promote features that enhance visual clarity and easy mental processing of even the most
  complex architectures.
- **Users control the data.** We store nothing, but provide convenient ways for users to save and share their designs.
- **Embrace community contributions.** Consider and respond to all feedback and pull requests in the context of these
  tenants.

## Building From Source

If you have a more opinionated best-practice way to lay out this repository please open an issue.

Build prerequisites:
- npm
- sass

Compile from source:

```shell
# Clone the repository
> git clone https://github.com/ckabalan/visualsubnetcalc
# Use reccomended NVM version
> nvm use
# Change to the sources directory
> cd visualsubnetcalc/src
# Install Bootstrap
> npm install
# Compile Bootstrap (Also install sass command line globally)
> npm run build
```

The full application should then be available within `./dist/`, open `./dist/index.html` in a browser.

## License

Visual Subnet Calculator is released under the [MIT License](https://opensource.org/licenses/MIT)

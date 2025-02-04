# Visual Subnet Calculator - [visualsubnetcalc.com](https://visualsubnetcalc.com)

![demo.gif](src%2Fdemo.gif)

Visual Subnet Calculator is a modernized tool based on the original work by [davidc](https://github.com/davidc/subnets).
It strives to be a tool for quickly designing networks and collaborating on that design with others. It focuses on
expediting the work of network administrators, not academic subnetting math.

## Design Tenets

The following tenets are the most important values that drive the design of the tool. New features, pull requests, etc
should align to these tenets, or propose an adjustment to the tenets.

- **Simplicity is king.** Network admins are busy and Visual Subnet Calculator should always be easy for FIRST TIME USERS to
  quickly and intuitively use.
- **Subnetting is design work.** Promote features that enhance visual clarity and easy mental processing of even the most
  complex architectures.
- **Users control the data.** We store nothing, but provide convenient ways for users to save and share their designs.
- **Embrace community contributions.** Consider and respond to all feedback and pull requests in the context of these
  tenets.

## Cloud Subnet Notes

### Standard mode:

- Smallest subnet: /32
- Two reserved addresses per subnet of size <= 30:
  - Network Address (network + 0)
  - Broadcast Address (last network address)

### AWS mode ([docs](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html)):

- Smallest subnet: /28
- Five reserved addresses per subnet:
  - Network Address (network + 0)
  - AWS Reserved - VPC Router
  - AWS Reserved - VPC DNS
  - AWS Reserved - Future Use
  - Broadcast Address (last network address)

### Azure mode ([docs](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets)):

- Smallest subnet: /29
- Five reserved addresses per subnet:
  - Network Address (network + 0)
  - Azure Reserved - Default Gateway
  - Azure Reserved - DNS Mapping
  - Azure Reserved - DNS Mapping
  - Broadcast Address (last network address)

## Building From Source

If you have a more opinionated best-practice way to lay out this repository please open an issue.

Build prerequisites:

- (Optional but recommended) NVM to manage node version
- node.js (version 20) and associated NPM.
- sass (Globally installed, following instructions below.)

Compile from source:

```shell
# Clone the repository
> git clone https://github.com/ckabalan/visualsubnetcalc
# Change to the repository directory
> cd visualsubnetcalc
# Use recommended NVM version
> nvm use
# Change to the sources directory
> cd src
# Install Bootstrap
> npm install
# Compile Bootstrap (Also install sass command line globally)
> npm run build
# Run the local webserver
> npm start
```

The full application should then be available within `./dist/`, open `./dist/index.html` in a browser.

### Run with certificates (Optional)

**_NB:_** _required for testing clipboard.writeText() in the browser. Feature is only available in secure (https) mode._

```shell

#Install mkcert
> brew install mkcert
# generate CA Certs to be trusted by local browsers
> mkcert install
# generate certs for local development
> cd visualsubnetcalc/src
# generate certs for local development
> npm run setup:certs
# run the local webserver with https
> npm run local-secure-start
```

## Running in a container

The application is also available as a container from https://hub.docker.com/r/ckabalan/visualsubnetcalc.
The container is built automatically and pushed to dockerhub on pushes to the develop branch and when when a new git tag is created.

### Available Image Tags

| Image Tag | Description                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------- |
| develop   | Images built from the develop branch                                                                  |
| latest    | The latest container image that points to the most recent semantic version built from the main branch |
| v1.1.7    | Semantic version generated from git tag from the main branch                                          |

### Running locally

```bash
# Unprivilged container exposes port 8080 and runs as a non root user.
docker run -d -p8080:8080 --name visualsubnetcalc ckabalan/visualsubnetcalc:latest
```

## Credits

Split icon made by [Freepik](https://www.flaticon.com/authors/freepik) from [Flaticon](https://www.flaticon.com/).

## License

Visual Subnet Calculator is released under the [MIT License](https://opensource.org/licenses/MIT)

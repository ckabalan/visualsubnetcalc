const subnetMapSchema = {
    type: "object",
    properties: {
      config_version: {
        type: "string",
      },
      operating_mode: {
        type: "string",
      },
      subnets: {
        type: "object",
        patternProperties: {
          "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/(3[0-2]|[1-2]?[0-9])$":
            {
              $ref: "#/definitions/Subnet",
            },
        },
        additionalProperties: false,
      },
    },
    additionalProperties: false,
    required: ["config_version", "subnets"],
    definitions: {
      Subnet: {
        anyOf: [
          {
            $ref: "#/definitions/SubnetProperties",
          },
          {
            type: "object",
            patternProperties: {
              "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/(3[0-2]|[1-2]?[0-9])$":
                {
                  $ref: "#/definitions/Subnet",
                },
            },
            additionalProperties: false,
          },
        ],
      },
      SubnetProperties: {
        type: "object",
        properties: {
          _note: {
            type: "string",
          },
          _color: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    },
};
  


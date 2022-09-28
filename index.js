const fs = require("fs").promises;

const getName = (source) => {
  const namePattern = /protocol ([A-Za-z0-9]+) {/;
  const matched = source.match(namePattern);
  const protocolName = matched[1];

  if (!protocolName) {
    return null;
  }

  return protocolName;
};

const getProperties = (source) => {
  const varPattern = /var [a-zA-Z0-9]+:\s?[\[\]a-zA-Z0-9]+\??/g;
  const matched = source.match(varPattern);

  if (!matched) {
    return [];
  }

  return matched
    .map((match) => {
      const matches = match.match(
        /var ([a-zA-Z0-9]+):\s?([\[\]a-zA-Z0-9]+\??)/
      );
      if (!matches[1] && !matches[2]) {
        return null;
      }

      return {
        name: matches[1],
        type: matches[2],
      };
    })
    .flat();
};

const getFunctions = (source) => {
  const updateSource = source.replace(/,\n\s+/g, ", ");

  const fnPattern =
    /func ([a-zA-Z0-9]+)(\(.+\)?) ?(async)? ?(throws)? ?(->)? ?([A-Za-z0-9\[\]]+)?/g;
  const matched = updateSource.match(fnPattern);

  if (!matched) {
    return [];
  }

  return matched
    .map((match) => {
      const matches = match.match(
        /func ([a-zA-Z0-9]+)(\((?:[a-zA-Z0-9\s:\]\[\n,.]+)?\)?)( ?(async)? ?(throws)? ?(->)? ?)([A-Za-z0-9\[\]]+)?/
      );

      console.log(matches);
      if (!matches[1]) {
        return null;
      }

      const arrowIndex = matches.indexOf("->");
      const returnType = arrowIndex < 0 ? null : matches[arrowIndex + 1];

      return {
        name: matches[1],
        returnType,
        full: matches[0],
      };
    })
    .flat();
};

const parseProtocol = (source) => {
  const name = getName(source);
  const properties = getProperties(source);
  const functions = getFunctions(source);

  return {
    name,
    properties,
    functions,
  };
};

const createSpyData = (protocol) => {
  const name = protocol.name.replace(/(Protocol|able)/, "") + "Spy";
  const injectionProperties = protocol.functions
    .filter((fn) => fn.returnType != null)
    .map((fn) => {
      let name = fn.name,
        regex = /^[a-z]/;
      name = name.replace(regex, (match) => {
        return match.toUpperCase();
      });

      return {
        name: `fn${name}Result`,
        type: fn.returnType,
        ref: fn.name,
      };
    });

  const calledProperties = protocol.functions.map((fn) => {
    return {
      name: `${fn.name}Called`,
      type: "Bool",
      ref: fn.name,
    };
  });

  const properties = [
    { group: "default", properties: protocol.properties },
    { group: "injection", properties: injectionProperties },
    { group: "called", properties: calledProperties },
  ];

  const functions = [
    ...protocol.functions,
    { name: "resetSpy", returnType: null, full: "func resetSpy()" },
  ];
  return {
    name,
    protocol: protocol.name,
    properties,
    functions,
  };
};

const createSwiftSpy = (spyData) => {
  const header = [
    "//",
    "//  WalletHelperable.swift",
    "//  Avantis",
    "//",
    "//  Created by 🕷 Natacha on 28/9/2565 BE.",
    "//",
  ];

  const imports = ["", "import Foundation", ""];
  const className = [`class ${spyData.name}: ${spyData.protocol} {`];
  const properties = spyData.properties
    .map((group) => {
      const { properties: props, group: markName } = group;
      return [
        "",
        `    // MARK: - ${markName.toUpperCase()} PROPERTIES`,
        ...props.map((prop) => {
          if (markName == "called") {
            return `    var ${prop.name}: ${prop.type} = false`;
          } else {
            return `    var ${prop.name}: ${prop.type}`;
          }
        }),
      ];
    })
    .flat();

  const injectionParameters = spyData.properties
    .find((group) => group.group == "injection")
    .properties.map((prop) => `${prop.name}: ${prop.type}`)
    .join(", ");
  const injectionInit = spyData.properties
    .find((group) => group.group == "injection")
    .properties.map((prop) => `        self.${prop.name} = ${prop.name}`);

  const initFn = [
    "",
    `    init(${injectionParameters}) {`,
    ...injectionInit,
    "    }",
  ];

  const functions = spyData.functions
    .map((func) => {
      const calledProp = spyData.properties
        .find((group) => group.group == "called")
        .properties.find((prop) => prop.ref == func.name);

      const injectionProp = spyData.properties
        .find((group) => group.group == "injection")
        .properties.find((prop) => prop.ref == func.name);

      if (func.name == "resetSpy") {
        return [
          "",
          `    ${func.full} {`,
          ...spyData.properties
            .find((group) => group.group == "called")
            .properties.map((prop) => {
              return `      ${prop.name} = false`;
            }),
          "    }",
        ];
      }

      return [
        "",
        `    ${func.full} {`,
        !calledProp ? null : `      ${calledProp.name} = true`,
        !injectionProp ? null : `\n      return ${injectionProp.name}`,
        "    }",
      ];
    })
    .flat();

  const swiftString = [
    ...header,
    ...imports,
    ...className,
    ...properties,
    ...initFn,
    ...functions,
    "",
    "}",
    "",
  ].join("\n");

  return swiftString;
};

(async () => {
  const source = await fs.readFile("./input/sample.swift", {
    encoding: "utf-8",
  });
  const protocol = parseProtocol(source);
  const spyData = createSpyData(protocol);
  const swiftSpy = createSwiftSpy(spyData);

  await fs.writeFile(`./output/${spyData.name}.swift`, swiftSpy);
})();

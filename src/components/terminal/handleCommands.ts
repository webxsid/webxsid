interface ITermOutput {
  text: string;
  type: "input" | "output";
  color: string;
  size: number;
}

enum CommandList {
  help = ".help",
  clear = ".clear",
  pages = ".pages",
  goto = ".goto",
  whoami = ".whoami",
  connect = ".connect",
  fullscreen = ".fullscreen",
  exit = ".exit",
  name = ".name",
}

const Pages = {
  home: "/",
  about: "/about-me",
  projects: "/projects",
  connect: "/connect",
  now: "/now",
};

const handleCommands = (
  command: string
): { output?: ITermOutput[]; action?: string } => {
  let output: ITermOutput[] = [];
  let action: string = "";
  const cmd = command.split(" ")[0];
  const args = command.split(" ").slice(1);

  if (!cmd.startsWith(".")) {
    if (Object.keys(CommandList).includes(cmd)) {
      output = [
        {
          text: `Command ${cmd} not found. Did you mean ${CommandList[cmd]}?`,
          type: "output",
          color: "#f80",
          size: 1,
        },
      ];
      return { output, action };
    }
  }
  switch (cmd) {
    case CommandList.help:
      output = [
        {
          text: "Available commands:",
          type: "output",
          color: "#fff",
          size: 1,
        },
        {
          text: ".help - show this help",
          type: "output",
          color: "#fff",
          size: 1,
        },
        {
          text: ".clear - clear the terminal",
          type: "output",
          color: "#fff",
          size: 1,
        },
        {
          text: ".name [name] - set your name",
          type: "output",
          color: "#fff",
          size: 1,
        },
        {
          text: ".pages - list all pages",
          type: "output",
          color: "#fff",
          size: 1,
        },
        {
          text: ".goto [page] - go to a page",
          type: "output",
          color: "#fff",
          size: 1,
        },
        {
          text: ".whoami - show who I am",
          type: "output",
          color: "#fff",
          size: 1,
        },
        {
          text: ".connect - connect with me",
          type: "output",
          color: "#fff",
          size: 1,
        },
        {
          text: ".fullscreen - toggle fullscreen",
          type: "output",
          color: "#fff",
          size: 1,
        },
        {
          text: ".exit - exit the terminal",
          type: "output",
          color: "#fff",
          size: 1,
        },
      ];
      break;
    case CommandList.clear:
      action = "clear";
      break;
    case CommandList.pages:
      output = [
        {
          text: "Available pages:",
          type: "output",
          color: "#fff",
          size: 1,
        },
        {
          text: "home",
          type: "output",
          color: "#fff",
          size: 1,
        },
        {
          text: "about",
          type: "output",
          color: "#fff",
          size: 1,
        },
        {
          text: "projects",
          type: "output",
          color: "#fff",
          size: 1,
        },
        {
          text: "contact",
          type: "output",
          color: "#fff",
          size: 1,
        },
      ];
      break;
    case CommandList.goto:
      if (args.length === 0) {
        output = [
          {
            text: "Please specify a page",
            type: "output",
            color: "#f00",
            size: 1,
          },
        ];
      } else {
        if (!Object.keys(Pages).includes(args[0])) {
          output = [
            {
              text: `Page not found: ${args[0]}`,
              type: "output",
              color: "#f00",
              size: 1,
            },
          ];
          break;
        }
        output = [
          {
            text: `Navigating to ${args[0]}...`,
            type: "output",
            color: "#0ff",
            size: 1,
          },
        ];
        action = `navigate ${Pages[args[0] as keyof typeof Pages]}`;
      }
      break;
    case CommandList.whoami:
      output = [
        {
          text: "Hi, I'm a Fullstack developer from India.",
          type: "output",
          color: "#fff",
          size: 1,
        },
      ];
      break;
    case CommandList.connect:
      output = [
        {
          text: "You can connect with me on:",
          type: "output",
          color: "#fff",
          size: 1.3,
        },
        {
          text: "Linkedin",
          type: "output",
          color: "#ff0",
          size: 1,
          link: "https://www.linkedin.com/in/webxsid/",
        },
        {
          text: "Github",
          type: "output",
          color: "#ff0",
          size: 1,
          link: "https://www.github.com/sm2101",
        },
        {
          text: "Instagram",
          type: "output",
          color: "#ff0",
          size: 1,
          link: "https://www.instagram.com/webxsid/",
        },
        {
          text: "Mail",
          type: "output",
          color: "#ff0",
          size: 1,
          link: "mailto:siddharthmittal2101@gmail.com",
        },
      ];
      break;
    case CommandList.fullscreen:
      action = "fullscreen";
      break;
    case CommandList.exit:
      console.log("exit");
      action = "exit";
      break;
    case CommandList.name:
      if (args.length === 0) {
        output = [
          {
            text: "Please specify a name",
            type: "output",
            color: "#f00",
            size: 1,
          },
        ];
      } else {
        output = [
          {
            text: `Hey ${args[0]}, nice to meet you!`,
            type: "output",
            color: "#0f0",
            size: 1,
          },
        ];
        action = `name ${args[0]}`;
      }
      break;
    default:
      output = [
        {
          text: `Command not found: ${cmd}`,
          type: "output",
          color: "#f00",
          size: 1,
        },
      ];
      break;
  }

  return { output, action };
};

export default handleCommands;

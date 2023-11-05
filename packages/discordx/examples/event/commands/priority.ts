import { Discord, On } from "discordx";

enum PriorityLevel {
  High,
  Moderate,
  Low,
}

@Discord()
export class Example {
  @On({ event: "ready", priority: PriorityLevel.Low })
  onReady(): void {
    console.log(PriorityLevel[PriorityLevel.Low]);
  }

  @On({ event: "ready", priority: PriorityLevel.High })
  onReady3(): void {
    console.log(PriorityLevel[PriorityLevel.High]);
  }

  @On({ event: "ready", priority: PriorityLevel.Moderate })
  onReady2(): void {
    console.log(PriorityLevel[PriorityLevel.Moderate]);
  }
}

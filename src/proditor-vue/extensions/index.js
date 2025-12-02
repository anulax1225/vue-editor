import { Image } from "./nodes/image";
import { TaskList } from "./nodes/taskList";
import { TaskItem } from "./nodes/taskItem";
import { Details } from "./nodes/details";
import { Callout } from "./nodes/callout";
import { Grid } from "./nodes/grid";
import { GridItem } from "./nodes/gridItem";
import { Card } from "./nodes/card";
import { CardHeader } from "./nodes/cardHeader";
import { CardBody } from "./nodes/cardBody";
import { CardFooter } from "./nodes/cardFooter";
import { Hero } from "./nodes/hero";
import { TextColorWithComponent } from "./mark/textColorWithComponent";
import { HeadingWithComponent } from "./nodes/headingWithComponent";
import { TableWithComponent } from "./nodes/tableWithComponent";

export const base = {
    Image,
    TaskList,
    TaskItem,
    Details,
    Callout,
    GridItem,
    Grid,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Hero,
    HeadingWithComponent,
    TextColorWithComponent,
    TableWithComponent,
}

export const extensions = [
    Image,
    TaskList,
    TaskItem,
    Details,
    Callout,
    GridItem,
    Grid,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Hero,
    HeadingWithComponent,
    TextColorWithComponent,
    TableWithComponent,
];
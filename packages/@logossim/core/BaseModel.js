import { Point } from '@projectstorm/geometry';
import { NodeModel } from '@projectstorm/react-diagrams';

import PortModel from './Port/PortModel';
import { DEFAULT_PORT_CONFIGURATION } from './Simulation/const';
import { emit } from './Simulation/SimulationEngine';
import {
  adjustValueToBits,
  convertNumberValueToArray,
  isValueValid,
} from './Simulation/utils';

const getPort = port => {
  if (port instanceof PortModel) return port;
  return new PortModel({ name: port });
};

export default class BaseModel extends NodeModel {
  constructor(configurations = {}, type = 'generic') {
    super({ type });

    this.initialize(configurations);

    this.configurations = configurations;
  }

  serialize() {
    return {
      ...super.serialize(),
      configurations: this.configurations,
    };
  }

  addInputPort(name, { bits = 1 } = DEFAULT_PORT_CONFIGURATION) {
    const port = getPort(name);
    port.setAsInput();
    if (typeof name === 'string') port.setBits(bits);
    super.addPort(port);
  }

  addOutputPort(name, { bits = 1 } = DEFAULT_PORT_CONFIGURATION) {
    const port = getPort(name);
    port.setAsOutput();
    if (typeof name === 'string') port.setBits(bits);
    super.addPort(port);
  }

  addPort(name, { bits = 1 } = DEFAULT_PORT_CONFIGURATION) {
    const port = getPort(name);

    if (port.isInput()) {
      this.addInputPort(port, bits);
      return;
    }

    if (port.isOutput()) {
      this.addOutputPort(port, bits);
      return;
    }

    throw new Error(
      '[logossim] Use either `addInputPort` or `addOutputPort`',
    );
  }

  removePort(name) {
    const port = getPort(name);
    super.removePort(port);
  }

  getInputPorts() {
    return Object.fromEntries(
      Object.entries(this.getPorts()).filter(([, port]) =>
        port.isInput(),
      ),
    );
  }

  getOutputPorts() {
    return Object.fromEntries(
      Object.entries(this.getPorts()).filter(
        ([, port]) => !port.isInput(),
      ),
    );
  }

  getAllLinks() {
    return Object.values(this.getPorts())
      .map(port => port.getMainLink())
      .filter(link => !!link)
      .reduce(
        (arr, link) => [...arr, link, ...link.getAllBifurcations()],
        [],
      );
  }

  clone(...args) {
    const clone = super.clone(...args);
    clone.setPosition(new Point(this.getX() + 15, this.getY() + 15));
    return clone;
  }

  initialize() {}

  onSimulationStart() {}

  onSimulationPause() {}

  onSimulationStop() {}

  step() {}

  emit(value) {
    emit(this.getID(), value);
  }

  // Methods to facilitate unit testing
  createAudio() {}

  stepAndMask(input) {
    const stepResult = this.step(input);

    return Object.fromEntries(
      Object.entries(stepResult).map(([portName, portValue]) => {
        const { bits } = this.getPort(portName);
        let value = portValue;
        if (typeof value === 'number') {
          value = convertNumberValueToArray(
            adjustValueToBits(portValue, bits),
            bits,
          );
        } else if (value === 'x' || value === 'e') {
          value = Array(bits).fill(value);
        }

        return [
          portName,
          isValueValid(value, bits) ? value : Array(bits).fill('e'),
        ];
      }),
    );
  }
}

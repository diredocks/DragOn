import {
  HexToRGBA,
  HSVToRGB,
  RGBAToHex,
  RGBToHSV,
} from "@/shared/utils/common";
import { PopupBox } from "./PopupBox";

const checkboardCss =
  "bg-[linear-gradient(45deg,#ddd_25%,transparent_25%),linear-gradient(-45deg,#ddd_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ddd_75%),linear-gradient(-45deg,transparent_75%,#ddd_75%)] bg-size-[10px_10px] bg-position-[0_0,0_5px,5px_-5px,-5px_0]";
const checkboardContainer = `absolute overflow-hidden rounded-sm ${checkboardCss}`;
const sliderThumbCss =
  "absolute left-0 right-0 h-2 -mt-1 border-2 border-white rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.6)] pointer-events-none box-border";
const innerShadowCss =
  "after:content-[''] after:absolute after:inset-0 after:rounded-sm after:shadow-[inset_0_0_4px_1px_rgba(0,0,0,0.15)] after:pointer-events-none";
const fieldThumbCss =
  "absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full shadow-sm pointer-events-none box-border";

type ColorPickerProps = {
  value: string;
  onChange: (hex: string) => void;
};

export function ColorPicker(props: ColorPickerProps) {
  const initialRGBA = HexToRGBA(props.value);
  const initialHSV = RGBToHSV(initialRGBA);

  const [hue, setHue] = createSignal(initialHSV[0]);
  const [saturation, setSaturation] = createSignal(initialHSV[1]);
  const [value, setValue] = createSignal(initialHSV[2]);
  const [alpha, setAlpha] = createSignal(initialRGBA[3]);

  const rgba = () => {
    const [r, g, b] = HSVToRGB([hue(), saturation(), value()]);
    return [r, g, b, alpha()] as [number, number, number, number];
  };

  createEffect(() => {
    const rgbaVal = HexToRGBA(props.value);
    const [h, s, v] = RGBToHSV(rgbaVal);
    setHue(h);
    setSaturation(s);
    setValue(v);
    setAlpha(rgbaVal[3]);
  });

  const handlePointer = (
    e: PointerEvent,
    callback: (x: number, y: number) => void,
  ) => {
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      const rect = target.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height));
      callback(x, y);
    };
    onMove(e);
    target.onpointermove = onMove;
    target.onpointerup = () => {
      target.onpointermove = null;
      target.onpointerup = null;
    };
  };

  const handleRGBAInput = (index: number, valStr: string) => {
    const num = parseFloat(valStr);
    if (Number.isNaN(num)) return;

    if (index === 3) {
      const val = Math.max(0, Math.min(1, num));
      setAlpha(val);
    } else {
      const val = Math.max(0, Math.min(255, num));
      const current = rgba();
      current[index] = val;
      const [h, s, v] = RGBToHSV([current[0], current[1], current[2]]);
      setHue(h);
      setSaturation(s);
      setValue(v);
    }
    props.onChange(RGBAToHex(rgba()));
  };

  return (
    <PopupBox
      title="Color Picker"
      trigger={
        <button
          type="button"
          class="relative box-border h-9.5 w-12 cursor-pointer rounded-sm border border-outline bg-transparent p-1.25"
        >
          <div class={`${checkboardContainer} inset-1 border border-outline`}>
            <div
              class="absolute inset-0"
              style={{ "background-color": RGBAToHex(rgba()) }}
            />
          </div>
        </button>
      }
    >
      <div class="flex flex-col gap-4">
        <div class="flex select-none flex-row items-stretch gap-4">
          {/* SV Field */}
          <div
            class={`relative h-64 w-64 cursor-crosshair overflow-hidden rounded-sm ${innerShadowCss}`}
            style={{
              "background-color": `hsl(${hue()}, 100%, 50%)`,
              "background-image":
                "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
            }}
            onPointerDown={(e) =>
              handlePointer(e, (x, y) => {
                setSaturation(x);
                setValue(1 - y);
                props.onChange(RGBAToHex(rgba()));
              })
            }
          >
            <div
              class={fieldThumbCss}
              style={{
                left: `${saturation() * 100}%`,
                top: `${(1 - value()) * 100}%`,
              }}
            />
          </div>

          {/* Hue Slider */}
          <div
            class={`relative h-64 w-6.25 cursor-pointer overflow-hidden rounded-sm ${innerShadowCss}`}
            style={{
              background:
                "linear-gradient(to bottom, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
            }}
            onPointerDown={(e) =>
              handlePointer(e, (_, y) => {
                setHue(y * 360);
                props.onChange(RGBAToHex(rgba()));
              })
            }
          >
            <div
              class={sliderThumbCss}
              style={{ top: `${(hue() / 360) * 100}%` }}
            />
          </div>

          {/* Alpha Slider */}
          <div
            class={`relative h-64 w-6.25 cursor-pointer overflow-hidden rounded-sm ${checkboardCss} ${innerShadowCss}`}
            onPointerDown={(e) =>
              handlePointer(e, (_, y) => {
                setAlpha(Number((1 - y).toFixed(2)));
                props.onChange(RGBAToHex(rgba()));
              })
            }
          >
            <div
              class="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, rgba(${rgba().slice(0, 3).join(",")},1), transparent)`,
              }}
            />
            <div
              class={`${sliderThumbCss} z-20`}
              style={{ top: `${(1 - alpha()) * 100}%` }}
            />
          </div>

          {/* Inputs & Preview */}
          <div class="flex flex-col justify-between">
            {(["R", "G", "B", "A"] as const).map((label, i) => (
              <div>
                <label class="flex items-center text-sm">
                  {label}
                  <input
                    type="number"
                    class="ml-2 h-8 w-16 rounded border px-1"
                    value={i === 3 ? alpha() : Math.round(rgba()[i])}
                    onInput={(e) => handleRGBAInput(i, e.currentTarget.value)}
                    min="0"
                    max={i === 3 ? "1" : "255"}
                    step={i === 3 ? "0.01" : "1"}
                  />
                </label>
              </div>
            ))}
            <div
              class={`relative aspect-square w-full overflow-hidden rounded-sm border border-gray-100 ${innerShadowCss}`}
            >
              <div class={`inset-0 ${checkboardContainer}`}>
                <div
                  class="absolute inset-0"
                  style={{ "background-color": RGBAToHex(rgba()) }}
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <input
            type="text"
            class="h-8 flex-1 rounded border px-2 font-mono text-sm uppercase focus:outline-primary"
            value={RGBAToHex(rgba())}
            pattern="#[a-fA-F0-9]{8}"
            onInput={(e) => props.onChange(e.currentTarget.value)}
            spellcheck={false}
          />
        </div>
      </div>
    </PopupBox>
  );
}

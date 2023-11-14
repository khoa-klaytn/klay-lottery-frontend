import * as d3 from 'd3'
import { Input } from '@sweepstakes/uikit'
import { useImperativeHandle, ChangeEvent, ForwardedRef, useState, forwardRef, useMemo, useRef } from 'react'
import { EMsg } from '../../EMsg'

interface RewardsBreakdownProps {
  value: string[]
  setRewardsBreakdown: (cb: (value: string[]) => string[]) => void
}

export type RewardsBreakdownRef = { setEMsg: (msg: string) => void }

type Data = { name: string; value: number }

const width = 928
const height = Math.min(width, 500)
const radius = Math.min(width, height) / 2
const viewBox = [-width / 2, -height / 2, width, height]

const arc = d3.arc().innerRadius(0).outerRadius(radius)
const pie = d3
  .pie<Data>()
  .padAngle(1 / radius)
  .sort(null)
  .value((d) => d.value)

function RewardsBreakdown(
  { value, setRewardsBreakdown }: RewardsBreakdownProps,
  forwardedRef: ForwardedRef<RewardsBreakdownRef>,
) {
  const g1Ref = useRef<SVGSVGElement>(null)
  const g2Ref = useRef<SVGSVGElement>(null)
  const [eMsg, setEMsg] = useState('') // [rewards] error message

  const data = useMemo(() => {
    const _data = new Array<Data>(value.length + 1)
    let sum = 0
    for (let i = value.length; i--; ) {
      const n = i + 1
      const v = +value[i]
      _data[n] = { name: `Match ${n}`, value: v }
      sum += v
    }
    _data[0] = { name: 'All winners', value: 10000 - sum }
    return _data
  }, [value])

  const [g1Children, g2Children] = useMemo(() => {
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(d3.quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

    const pieData = pie(data)

    const _g1Children = []
    const _g2Children = []
    for (const d of pieData) {
      _g1Children.push(
        <path key={d.index} fill={color(d.data.name) as string} d={arc(d)}>
          <title>{`${d.data.name}: ${d.data.value.toLocaleString()}`}</title>
        </path>,
      )

      if (d.endAngle - d.startAngle > 0.25) {
        _g2Children.push(
          <text
            key={d.index}
            transform={`translate(${arc.centroid(d)})`}
            style={{ fontFamily: 'sans-serif', fontSize: 16, textAnchor: 'middle' }}
          >
            <tspan y="-0.4em" fontWeight="bold">
              {d.data.name}
            </tspan>
            <tspan x="0" y="0.7em" fillOpacity={0.7}>
              {d.data.value.toLocaleString('en-US')}
            </tspan>
          </text>,
        )
      }
    }

    return [_g1Children, _g2Children]
  }, [data])

  const elArr = useMemo(() => {
    const { length } = value

    const arr = new Array(length)
    for (let i = length; i--; ) {
      const v = value[i]
      arr[i] = (
        <label key={i}>
          {i + 1}
          <Input
            type="number"
            value={v}
            onInput={(ev: ChangeEvent<HTMLInputElement>) => {
              const { value: evTargetV } = ev.currentTarget
              setEMsg('')
              setRewardsBreakdown((prev) => {
                const newValue = [...prev]
                newValue[i] = evTargetV
                return newValue
              })
            }}
          />
        </label>
      )
    }
    return arr
  }, [value, setRewardsBreakdown])

  useImperativeHandle(forwardedRef, () => ({
    setEMsg,
  }))

  return (
    <fieldset>
      <header>Reward Portions</header>
      {eMsg && <EMsg>{eMsg}</EMsg>}
      <svg height={height} width={width} viewBox={viewBox.toString()} style={{ maxWidth: '100%', height: 'auto' }}>
        <g ref={g1Ref}>{g1Children}</g>
        <g ref={g2Ref}>{g2Children}</g>
      </svg>
      {elArr}
    </fieldset>
  )
}

export default forwardRef(RewardsBreakdown)
